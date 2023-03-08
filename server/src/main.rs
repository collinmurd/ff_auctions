
use server::mtbws;

fn main() {
    let server = mtbws::server::Server::new();
    server.listen()
}

