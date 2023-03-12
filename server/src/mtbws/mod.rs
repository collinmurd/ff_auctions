
// More Than Basic Web Server

use std::collections::HashMap;

use strum_macros::EnumString;

use request::{Request};


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


#[derive(Debug)]
pub struct HeaderMap {
    headers: HashMap<String, String>
}

impl HeaderMap {
    pub fn new() -> HeaderMap {
        HeaderMap { headers: HashMap::new() }
    }

    pub fn add(&mut self, name: String, value: String) {
        self.headers.insert(name, value);
    }

    pub fn add_from_line(&mut self, line: String) -> Result<(), &'static str> {
        match line.split_once(": ") {
            Some((name, value)) => {
                self.add(name.to_string(), value.to_string());
                return Result::Ok(());
            }
            None => Result::Err("Invalid Header line")
        }
    }

    pub fn get(&self, name: String) -> Option<&String> {
        match self.headers.get(&name) {
            Some(v) => Option::Some(v),
            None => Option::None
        }
    }
}


pub struct Response {
    status_code: u8,
    headers: HeaderMap,
    content: String
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_headers() {
        let mut header_map = HeaderMap::new();
        let good = String::from("Content-Type: something");
        assert!(header_map.add_from_line(good).is_ok());
        assert!(header_map.get(String::from("Content-Type")).is_some());
        assert_eq!(header_map.get(String::from("Content-Type")).unwrap(), "something");

        let bad = String::from("ahhhhhhhhhhh!");
        assert!(header_map.add_from_line(bad).is_err());
    }
}