
use std::str::FromStr;

use super::{HTTPMethod,  HeaderMap};

pub struct Request<'r> {
    pub control: Control<'r>,
    pub headers: HeaderMap<'r>,
    pub content: String
}

impl<'r> Request<'r> {
    /// Creates a [Request] object from a [std::Vec](Vec<String>) 
    /// representing the lines of an HTTP request.
    pub fn from_lines(lines: Vec<&'r str>) -> Result<Request<'r>, CreateRequestError> {
        let control = Control::from(lines[0])?;
        let mut headers = HeaderMap::new();
        for line in lines.iter().skip(1) {
            let clean_line = line.trim();
            if clean_line != "" {
                match headers.add_from_line(clean_line) {
                    Ok(_) => (),
                    Err(_) => return Result::Err(CreateRequestError::InvalidHeader)
                };
            }
        }

        Result::Ok(Request { control: control, headers: headers, content: String::new() })
    }
}

pub struct Control<'a> {
    pub method: HTTPMethod,
    pub uri: &'a str,
    pub version: &'a str 
}

impl<'r> Control<'r> {
    pub fn from(control_line: &'r str) -> Result<Control<'r>, CreateRequestError> {
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
    InvalidControlLine,
    InvalidHeader
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn request_from_lines() {
        let good_lines = vec!["GET / HTTP/1.1", "My-Header: something"];
        let bad_control = vec!["POST HTTP/1.1", "My-Header: something"];
        let bad_header = vec!["GET / HTTP/1.1", "ahhhhh!"];

        let req = Request::from_lines(good_lines).unwrap();
        assert_eq!(req.control.uri, String::from("/"));
        assert!(req.headers.get("My-Header").is_some());
        assert_eq!(req.headers.get("My-Header").unwrap(), "something");

        assert!(Request::from_lines(bad_control).is_err());
        assert!(Request::from_lines(bad_header).is_err());
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