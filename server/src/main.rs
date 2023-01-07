use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use serde::Serialize;

#[derive(Serialize)]
struct Player<'a> {
    name: &'a str,
    position: &'a str 
}

#[derive(Serialize)]
struct AuctionResponse<'a> {
    players: Vec<Player<'a>>
}

async fn get_current_auction() -> impl Responder {
    let player = Player {
        name: "Justin Jefferson",
        position: "WR"
    };
    let resp = AuctionResponse {
        players: vec![
            player
        ]
    };
    return HttpResponse::Ok().json(web::Json(resp))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(
                web::scope("/auction")
                    .route("", web::get().to(get_current_auction))
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}