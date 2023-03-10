
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

impl Header {
    pub fn from(line: String) -> Result<Header, &'static str> {
        match line.split_once(": ") {
            Some((name, value)) => Result::Ok(Header { 
                name: String::from(name),
                value: String::from(value)
            }),
            None => Result::Err("Invalid Header line")
        }
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
    fn parse_headers() {
        let good = String::from("Content-Type: something");
        let headers = Header::from(good).unwrap();
        assert_eq!(headers.name, String::from("Content-Type"));
        assert_eq!(headers.value, String::from("something"));

        let bad = String::from("ahhhhhhhhhhh!");
        assert!(Header::from(bad).is_err());
    }
}