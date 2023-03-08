
use server::mtbws;

fn main() {
    let server = mtbws::Server::new();
    server.listen()
}

