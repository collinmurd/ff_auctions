
use server::mtbws;

fn main() {
    let server = mtbws::server::Server::new(7878);
    server.listen()
}

