
use super::HeaderMap;

pub struct Response {
    pub status_code: u8,
    pub headers: HeaderMap,
    pub content: String
}