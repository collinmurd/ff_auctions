
// More Than Basic Web Server

use strum_macros::EnumString;

use request::{Request, Control};

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

pub mod server;
pub mod request;

pub struct Header {
    name: String,
    value: String
}




pub struct Response {
    status_code: u8,
    headers: Vec<Header>,
    content: String
}
