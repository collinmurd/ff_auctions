
mod mtbws;

fn main() {
    let server = mtbws::Server::new();
    server.listen()
}

