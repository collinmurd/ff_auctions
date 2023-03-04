
// More Than Basic Web Server

use std::net::{TcpListener, TcpStream};
use std::io::{prelude::*, BufReader};

pub struct Server {
    endpoints: Vec<Endpoint>
}

impl Server {

    pub fn new() -> Server {
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

    pub fn add_endpoint<F>(&mut self, pattern: String, handler: &'static dyn Fn(Request) -> Response) {
        self.endpoints.push(Endpoint { pattern: pattern, handler: handler });
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


struct Endpoint {
    pattern: String,
    handler: &'static dyn Fn(Request) -> Response
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