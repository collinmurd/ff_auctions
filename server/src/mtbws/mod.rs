
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

#[cfg(test)]
mod tests {
    use super::*;

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

    // #[test]
    // fn parse_headers() {
    //     let good = vec![
    //         String::from("Content-Type: something"),
    //         String::from("asdf: test")
    //     ];
    //     let headers = Server::parse_headers(good).unwrap();
    //     assert_eq!(headers.len(), 2);
    //     assert_eq!(headers[0].name, String::from("Content-Type"));
    //     assert_eq!(headers[1].value, String::from("test"));

    //     let bad = vec![String::from("ahhhhhhhhhhh!")];
    //     assert!(Server::parse_headers(bad).is_err());
    // }
}
