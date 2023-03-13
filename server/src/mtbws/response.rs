
use phf::phf_map;

use super::HeaderMap;

static STATUS_CODES: phf::Map<u16, &'static str> = phf_map! {
    100u16 => "Continue",
    101u16 => "Switching Protocols",

    200u16 => "OK",
    201u16 => "Created",
    202u16 => "Accepted",
    203u16 => "Non-Authoritative Information",
    204u16 => "No Content",
    205u16 => "Reset Content",
    206u16 => "Partial Content",

    300u16 => "Multiple Choices",
    301u16 => "Moved Permanently",
    302u16 => "Found",
    303u16 => "See Other",
    304u16 => "Not Modified",
    305u16 => "Use Proxy",
    307u16 => "Temporary Redirect",
    308u16 => "Permanent Redirect",

    400u16 => "Bad Request",
    401u16 => "Unauthorized",
    402u16 => "Payment Required",
    403u16 => "Forbidden",
    404u16 => "Not Found",
    405u16 => "Method Not Allowed",
    406u16 => "Not Acceptable",
    407u16 => "Proxy Authentication Required",
    408u16 => "Request Timeout",
    409u16 => "Conflict",
    410u16 => "Gone",
    411u16 => "Length Required",
    412u16 => "Precondition Failed",
    413u16 => "Content Too Large",
    414u16 => "URI Too Long",
    415u16 => "Unsupported Media Type",
    416u16 => "Range Not Satisfiable",
    417u16 => "Expectation Failed",
    421u16 => "Misdirected Request",
    422u16 => "Unprocessable Content",
    426u16 => "Upgrade Required",

    500u16 => "Internal Server Error",
    501u16 => "Not Implemented",
    502u16 => "Bad Gateway",
    503u16 => "Service Unavailable",
    504u16 => "Gateway Timeout",
    505u16 => "HTTP Version Not Supported",
};

const HTTP_VERSION: &str = "HTTP/1.1";

pub struct Response {
    status_code: u16,
    headers: HeaderMap,
    content: Vec<u8>
}

impl Response {
    pub fn new(status_code: u16) -> Option<Response> {
        if !STATUS_CODES.contains_key(&status_code) {
            return None;
        }
        Some(Response {
            status_code: status_code,
            headers: HeaderMap::new(),
            content: Vec::new()
        })
    }

    /// Return HTTP formatted response message
    pub fn http_format(&self) -> Vec<u8> {
        let mut head = String::new();
        let status_text = STATUS_CODES.get(&self.status_code).unwrap(); // unwrap safe because it's validated
        head.push_str(format!("{} {} {}", HTTP_VERSION, self.status_code, status_text).as_str());

        for header in &self.headers.headers {
            head.push_str(format!("\n{}: {}", header.0, header.1).as_str());
        }

        head.push_str("\n\n");
        let mut resp = head.as_bytes().to_vec();
        resp.extend(&self.content);

        resp
    }

    pub fn get_status_code(&self) -> u16 {
        self.status_code
    }
}