use std::net::{TcpListener, TcpStream};
use std::io::{prelude::*, BufReader};

use super::request::CreateRequestError;
use super::response::Response;
use super::{HTTPMethod, Request};

type Handler<'a> = &'a dyn Fn(&Request) -> Option<Response>;

pub struct Server<'a> {
    endpoints: Vec<Endpoint<'a>>
}

impl<'a> Server<'a> {

    pub fn new() -> Server<'a> {
        let mut s = Server {
            endpoints: Vec::new()
        };

        s.register_endpoint(HTTPMethod::GET, "/health".to_string(), &health_check_handler);

        s
    }

    pub fn listen(&self) {
        let listener = TcpListener::bind("127.0.0.1:7878").unwrap();

        for stream in listener.incoming() {
            let stream = stream.unwrap();

            self.handle_connection(stream);
        }
    }

    pub fn register_endpoint(&mut self, method: HTTPMethod, pattern: String, handler: Handler<'a>) {
        self.endpoints.retain(|endpoint| {
            endpoint.pattern != pattern || endpoint.method != method
        });
        self.endpoints.push(Endpoint { method: method, pattern: pattern, handler: handler });
    }

    fn handle_connection(&self, stream: TcpStream){
        let request = match self.create_request(&stream) {
            Ok(r) => r,
            Err(_) => {println!("400"); return;} // TODO: return a 400 response
        };

        for endpoint in &self.endpoints {
            if request.control.uri == endpoint.pattern {
                match endpoint.handle(&request) {
                    Some(r) => self.send_response(r, stream),
                    None => println!("Would respond with 500 here")
                }
                break;
            }
        }
    }

    fn create_request(&self, mut stream: &TcpStream) -> Result<Request, CreateRequestError> {
        let mut buf_reader = BufReader::new(&mut stream);
        let mut lines: Vec<String> = Vec::new();
        loop {
            let mut head_buf = String::new();
            let l = match buf_reader.read_line(&mut head_buf) {
                Ok(l) => l,
                Err(_) => return Err(CreateRequestError::ParseError)
            };
            if l < 3 {
                break;
            }
            lines.push(head_buf);
        }

        let mut request = Request::from_lines(lines)?;

        if let Some(length) = request.headers.get("Content-Length".to_string()) {
            let mut buf = vec![0u8; length.parse::<usize>().unwrap()];
            buf_reader.read_exact(&mut buf).unwrap(); // TODO: handle this

            request.append_content(buf);
        }

        Result::Ok(request)
    }

    fn send_response(&self, res: Response, mut stream: TcpStream) {
        match stream.write(&res.http_format()) {
            Err(e) => println!("Error writing to stream: {}", e),
            _ => ()
        }
    }
}

fn health_check_handler(_req: &Request) -> Option<Response> {
    Some(Response::new(200).unwrap())
}

struct Endpoint<'a> {
    method: HTTPMethod,
    pattern: String,
    handler: Handler<'a>
}

impl<'a> Endpoint<'a> {
    fn handle(&self, req: &Request) -> Option<Response> {
        (self.handler)(req)
    }
}


#[cfg(test)]
mod tests {
    use crate::mtbws::{HeaderMap, request::Control};

    use super::*;

    #[test]
    fn register_handler() {
        let mut server = Server::new();

        let mut header_map = HeaderMap::new();
        header_map.add(String::from("key"), String::from("value"));

        fn my_good_handler_fn(_req: &Request) -> Option<Response> {
            let mut header_map = HeaderMap::new();
            header_map.add(String::from("key"), String::from("value"));
            Some(Response::new(201).unwrap())
        }

        server.register_endpoint(HTTPMethod::GET, String::from("/"), &my_good_handler_fn);
        assert_eq!(server.endpoints.len(), 1);

        let req = Request {
            control: Control { method: HTTPMethod::GET, uri: String::from("/"), version: String::from("HTTP/1.1") },
            headers: header_map,
            content: "asdf".as_bytes().to_vec()
        };
        assert_eq!(server.endpoints.get(0).unwrap().handle(&req).unwrap().get_status_code(), 201);

        server.register_endpoint(HTTPMethod::GET, String::from("/asdf"), &my_good_handler_fn);
        assert_eq!(server.endpoints.len(), 2);

        server.register_endpoint(HTTPMethod::POST, String::from("/asdf"), &my_good_handler_fn);
        assert_eq!(server.endpoints.len(), 3);
    }
}