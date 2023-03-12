use std::net::{TcpListener, TcpStream};
use std::io::{prelude::*, BufReader};

use super::request::CreateRequestError;
use super::{HTTPMethod, Request, Response};

type Handler<'a> = &'a dyn Fn(Request) -> Response;

pub struct Server<'a> {
    endpoints: Vec<Endpoint<'a>>
}

impl<'a> Server<'a> {

    pub fn new() -> Server<'a> {
        return Server {
            endpoints: Vec::new()
        }
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

    fn handle_connection(&self, mut stream: TcpStream){
        let request = self.create_request(stream).unwrap();

        println!("{:#?}", request);
    }

    fn create_request(&self, mut stream: TcpStream) -> Result<Request, CreateRequestError> {
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

        println!("{:#?}", request);
        Result::Ok(request)
    }
}

struct Endpoint<'a> {
    method: HTTPMethod,
    pattern: String,
    handler: Handler<'a>
}

impl<'a> Endpoint<'a> {
    fn handle(&self, req: Request) -> Response {
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

        fn my_good_handler_fn(_req: Request) -> Response {
            let mut header_map = HeaderMap::new();
            header_map.add(String::from("key"), String::from("value"));
            Response {
                status_code: 201,
                headers: header_map,
                content: String::from("content")
            }
        }

        server.register_endpoint(HTTPMethod::GET, String::from("/"), &my_good_handler_fn);
        assert_eq!(server.endpoints.len(), 1);

        let req = Request {
            control: Control { method: HTTPMethod::GET, uri: String::from("/"), version: String::from("HTTP/1.1") },
            headers: header_map,
            content: "asdf".as_bytes().to_vec()
        };
        assert_eq!(server.endpoints.get(0).unwrap().handle(req).status_code, 201);

        server.register_endpoint(HTTPMethod::GET, String::from("/asdf"), &my_good_handler_fn);
        assert_eq!(server.endpoints.len(), 2);

        server.register_endpoint(HTTPMethod::POST, String::from("/asdf"), &my_good_handler_fn);
        assert_eq!(server.endpoints.len(), 3);
    }
}