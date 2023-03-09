
use std::str::FromStr;

use super::{HTTPMethod, Header};

pub struct Request<'r> {
    pub control: Control<'r>,
    pub headers: Vec<Header>,
    pub content: String
}

impl<'r> Request<'r> {
    /// Creates a [Request] object from a [std::Vec](Vec<String>) 
    /// representing the lines of an HTTP request.
    pub fn from_lines(lines: Vec<String>) -> Result<Request<'r>, &'static str> {
        unimplemented!();
    }
}

pub struct Control<'a> {
    pub method: HTTPMethod,
    pub uri: &'a str,
    pub version: &'a str 
}

impl<'r> Control<'r> {
    pub fn from(control_line: &'r String) -> Result<Control<'r>, CreateRequestError> {
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

        Result::Ok(Control { method: method, uri: control[1], version: version })
    }
}


#[derive(Debug)]
pub enum CreateRequestError {
    InvalidHTTPVersion,
    InvalidMethod,
    InvalidControlLine
}

#[cfg(test)]
mod tests {
    use super::*;

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
}