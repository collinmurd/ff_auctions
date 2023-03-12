
use std::{str::FromStr, str::from_utf8};

use super::{HTTPMethod,  HeaderMap};

pub struct Request {
    pub control: Control,
    pub headers: HeaderMap,
    pub content: Vec<u8>
}

impl Request {
    /// Creates a [Request] object from a [std::Vec](Vec<String>) 
    /// representing the lines of an HTTP request.
    pub fn from_lines(lines: Vec<String>) -> Result<Request, CreateRequestError> {
        if lines.len() < 1 {
            return Result::Err(CreateRequestError::EmptyRequest);
        }
        let control = Control::from(lines.get(0).unwrap().trim().to_string())?;
        let mut headers = HeaderMap::new();
        for line in lines.iter().skip(1) {
            let clean_line = line.trim();
            if clean_line != "" {
                match headers.add_from_line(clean_line.to_string()) {
                    Ok(_) => (),
                    Err(_) => return Result::Err(CreateRequestError::InvalidHeader)
                };
            }
        }

        Result::Ok(Request { control: control, headers: headers, content: Vec::new() })
    }

    pub fn append_content(&mut self, mut new_content: Vec<u8>) {
        self.content.append(&mut new_content);
    }
}

pub struct Control {
    pub method: HTTPMethod,
    pub uri: String,
    pub version: String 
}

impl Control {
    pub fn from(control_line: String) -> Result<Control, CreateRequestError> {
        let control: Vec<&str> = control_line.split(' ').collect();
        if control.len() != 3 {
            return Result::Err(CreateRequestError::InvalidControlLine);
        }

        let method = match HTTPMethod::from_str(control[0]) {
            Ok(m) => m,
            Err(_) => return Result::Err(CreateRequestError::InvalidMethod)
        };

        let version = control[2];
        if version != "HTTP/1.1" {
            return Result::Err(CreateRequestError::InvalidHTTPVersion);
        }

        Result::Ok(Control { method: method, uri: control[1].to_string(), version: version.to_string() })
    }
}


#[derive(Debug)]
pub enum CreateRequestError {
    InvalidHTTPVersion,
    InvalidMethod,
    InvalidControlLine,
    InvalidHeader,
    EmptyRequest
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn request_from_lines() {
        let good_lines = vec![String::from("GET / HTTP/1.1"), String::from("My-Header: something")];
        let bad_control = vec![String::from("POST HTTP/1.1"), String::from("My-Header: something")];
        let bad_header = vec![String::from("GET / HTTP/1.1"), String::from("ahhhhh!")];

        let req = Request::from_lines(good_lines).unwrap();
        assert_eq!(req.control.uri, String::from("/"));
        assert!(req.headers.get(String::from("My-Header")).is_some());
        assert_eq!(req.headers.get(String::from("My-Header")).unwrap(), "something");

        assert!(Request::from_lines(bad_control).is_err());
        assert!(Request::from_lines(bad_header).is_err());
    }

    #[test]
    fn parse_control() {
        let good_line = String::from("POST /asdf/fda?a=b HTTP/1.1");
        let bad_method = String::from("BLAH /asdf/fda?a=b HTTP/1.1");
        let missing_version = String::from("GET /asdf/fda?a=b ");

        let good_control = Control::from(good_line).unwrap();
        assert_eq!(good_control.method, HTTPMethod::POST);
        assert_eq!(good_control.uri, String::from("/asdf/fda?a=b"));
        assert_eq!(good_control.version, String::from("HTTP/1.1"));

        assert!(Control::from(bad_method).is_err());
        assert!(Control::from(missing_version).is_err());
    }

    #[test]
    fn append_content() {
        let good_lines = vec![String::from("GET / HTTP/1.1"), String::from("My-Header: something")];
        let mut req = Request::from_lines(good_lines).unwrap();
        req.append_content("new_content".as_bytes().to_vec());

        assert_eq!(from_utf8(&req.content).unwrap(), "new_content");
    }
}