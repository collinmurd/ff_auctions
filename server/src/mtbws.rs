
// More Than Basic Web Server

use std::net::{TcpListener, TcpStream};
use std::io::{prelude::*, BufReader};

type Handler<'a> = &'a dyn Fn(Request) -> Response;
#[derive(PartialEq)]
pub enum HTTPMethod {
    GET,
    HEAD,
    POST,
    PUT,
    DELETE,
    CONNECT,
    OPTIONS,
    TRACE
}
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

pub struct Header {
    key: String,
    value: String
}

pub struct Request {
    path: String,
    headers: Vec<Header>,
    data: String
}

pub struct Response {
    status_code: u8,
    headers: Vec<Header>,
    content: String
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
                headers: vec![Header{ key: String::from("key"), value: String::from("value ") }],
                content: String::from("content")
            }
        };

        fn my_good_handler_fn(_req: Request) -> Response {
            Response {
                status_code: 201,
                headers: vec![Header{ key: String::from("key"), value: String::from("value ") }],
                content: String::from("content")
            }
        }

        server.register_endpoint(HTTPMethod::GET, String::from("/"), &my_good_handler_closure);
        assert_eq!(server.endpoints.len(), 1);

        server.register_endpoint(HTTPMethod::GET, String::from("/"), &my_good_handler_fn);
        assert_eq!(server.endpoints.len(), 1);

        let req = Request {
            path: String::from("/"),
            headers: Vec::new(),
            data: String::from("asdf")
        };
        assert_eq!(server.endpoints.get(0).unwrap().handle(req).status_code, 201);

        server.register_endpoint(HTTPMethod::GET, String::from("/asdf"), &my_good_handler_fn);
        assert_eq!(server.endpoints.len(), 2);

        server.register_endpoint(HTTPMethod::POST, String::from("/asdf"), &my_good_handler_fn);
        assert_eq!(server.endpoints.len(), 3);
    }
}
