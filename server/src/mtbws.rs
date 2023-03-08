
// More Than Basic Web Server

use std::net::{TcpListener, TcpStream};
use std::io::{prelude::*, BufReader};
use strum_macros::EnumString;
use std::str::FromStr;

type Handler<'a> = &'a dyn Fn(Request) -> Response;
#[derive(Debug, PartialEq, EnumString)]
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

pub struct Header {
    name: String,
    value: String
}

pub struct Control<'a> {
    method: HTTPMethod,
    uri: &'a str,
    version: &'a str 
}

impl<'r> Control<'r> {
    fn from(control_line: &'r String) -> Result<Control<'r>, &'static str> {
        let control: Vec<&str> = control_line.split(' ').collect();
        if control.len() != 3 {
            return Result::Err("Misconfigured control line");
        }

        let method = match HTTPMethod::from_str(control[0]) {
            Ok(m) => m,
            Err(_) => return Result::Err("Invalid Method")
        };

        let version = control[2];
        if version != "HTTP/1.1" {
            return Result::Err("Invalid Version");
        }

        Result::Ok(Control { method: method, uri: control[1], version: version })
    }
}

pub struct Request<'r> {
    control: Control<'r>,
    headers: Vec<Header>,
    content: String
}

impl<'r> Request<'r> {
    /// Creates a [Request] object from a [std::Vec](Vec<String>) 
    /// representing the lines of an HTTP request.
    fn from_lines(lines: Vec<String>) -> Result<Request<'r>, &'static str> {
        unimplemented!();
    }
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
    fn request_from_lines() {
        let good_lines = vec![
            String::from("GET / HTTP/1.1"),
            String::from("My-Header: something"),
            String::from(""),
            String::from("asdf"),
            String::from("asdf line two")
        ];

        let req = Request::from_lines(good_lines).unwrap();
        assert_eq!(req.control.uri, String::from("/"));
        assert_eq!(req.headers.len(), 1);
        assert_eq!(req.headers.get(0).unwrap().name, String::from("My-Header"));
        assert_eq!(req.headers.get(0).unwrap().value, String::from("something"));
        assert_eq!(req.content, String::from("asdf\nasdf line two"));
    }


    #[test]
    fn parse_control() {
        let good_line = String::from("POST /asdf/fda?a=b HTTP/1.1");
        let bad_method = String::from("BLAH /asdf/fda?a=b HTTP/1.1");
        let missing_version = String::from("GET /asdf/fda?a=b ");

        let good_control = Control::from(&good_line).unwrap();
        assert_eq!(good_control.method, HTTPMethod::POST);
        assert_eq!(good_control.uri, String::from("/asdf/fda?a=b"));
        assert_eq!(good_control.version, String::from("HTTP/1.1"));

        assert!(Control::from(&bad_method).is_err());
        assert!(Control::from(&missing_version).is_err());
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
