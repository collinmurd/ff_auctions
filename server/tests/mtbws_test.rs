
use core::time;
use std::io::{Write, BufReader, BufRead};
use std::process::Command;
use std::net::TcpStream;
use std::thread;


#[test]
fn test_health_endpoint() {
    let mut s = Command::new("cargo")
                    .arg("run")
                    .spawn()
                    .unwrap();

    thread::sleep(time::Duration::from_millis(200));

    let mut stream = TcpStream::connect("127.0.0.1:7878").unwrap();
    stream.write("GET /health HTTP/1.1\n\n".as_bytes()).unwrap();

    thread::sleep(time::Duration::from_millis(200));

    let buf_reader = BufReader::new(&mut stream);
    let resp: Vec<_> = buf_reader.lines().take(1).map(|r| r.unwrap()).collect();
    assert_eq!(resp[0], "HTTP/1.1 200 OK".to_string());

    s.kill().unwrap();
}