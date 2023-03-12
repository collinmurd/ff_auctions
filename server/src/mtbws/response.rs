
use super::HeaderMap;

pub struct Response {
    pub status_code: u8,
    pub headers: HeaderMap,
    pub content: String
}

impl Response {
    pub fn new(status_code: u8) -> Response {
        Response {
            status_code: status_code,
            headers: HeaderMap::new(),
            content: String::new()
        }
    }

    /// Return HTTP formatted response message
    pub fn http_format(&self) -> Vec<u8> {
        vec![0u8, 4]
    }
}