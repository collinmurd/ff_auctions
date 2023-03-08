
use std::net::{TcpListener, TcpStream};
use std::io::{prelude::*, BufReader};

use super::{HTTPMethod, Handler, Header, Control, Request, Response};


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
        let buf_reader = BufReader::new(&mut stream);
        let http_request: Vec<_> = buf_reader.lines()
            .map(|result| result.unwrap())
            .take_while(|line| !line.is_empty())
            .collect();

        println!("Request: {:#?}", http_request);
    }

    /// Parses headers from an HTTP request given a [Vec<String>]
    /// Example `lines`:
    /// ```
    /// Content-Type: json
    /// My-Header: value
    /// ```
    fn parse_headers(lines: Vec<String>) -> Result<Vec<Header>, String> {
        let mut result: Vec<Header> = Vec::new();
        for line in lines {
            let (name, value) = match line.split_once(": ") {
                Some(t) => t,
                None => return Result::Err(format!("Invalid Header line: {}", line))
            };
            result.push(Header{name: String::from(name), value: String::from(value)});
        }

        Result::Ok(result)
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
    use super::*;

    #[test]
    fn register_handler() {
        let mut server = Server::new();

        let my_good_handler_closure = |_req: Request| -> Response {
            Response {
                status_code: 200,
                headers: vec![Header{ name: String::from("key"), value: String::from("value ") }],
                content: String::from("content")
            }
        };

        fn my_good_handler_fn(_req: Request) -> Response {
            Response {
                status_code: 201,
                headers: vec![Header{ name: String::from("key"), value: String::from("value ") }],
                content: String::from("content")
            }
        }

        server.register_endpoint(HTTPMethod::GET, String::from("/"), &my_good_handler_closure);
        assert_eq!(server.endpoints.len(), 1);

        server.register_endpoint(HTTPMethod::GET, String::from("/"), &my_good_handler_fn);
        assert_eq!(server.endpoints.len(), 1);

        let req = Request {
            control: Control { method: HTTPMethod::GET, uri: "/", version: "HTTP/1.1" },
            headers: Vec::new(),
            content: String::from("asdf")
        };
        assert_eq!(server.endpoints.get(0).unwrap().handle(req).status_code, 201);

        server.register_endpoint(HTTPMethod::GET, String::from("/asdf"), &my_good_handler_fn);
        assert_eq!(server.endpoints.len(), 2);

        server.register_endpoint(HTTPMethod::POST, String::from("/asdf"), &my_good_handler_fn);
        assert_eq!(server.endpoints.len(), 3);
    }

    #[test]
    fn parse_headers() {
        let good = vec![
            String::from("Content-Type: something"),
            String::from("asdf: test")
        ];
        let headers = Server::parse_headers(good).unwrap();
        assert_eq!(headers.len(), 2);
        assert_eq!(headers[0].name, String::from("Content-Type"));
        assert_eq!(headers[1].value, String::from("test"));

        let bad = vec![String::from("ahhhhhhhhhhh!")];
        assert!(Server::parse_headers(bad).is_err());
    }
}