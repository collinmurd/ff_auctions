// Component that contains the auction form

import './Auction.css'

import React from "react";

const data = [
    {
        "playerName": "Kyler Murray",
        "position": "QB"
    },
    {
        "playerName": "Nick Chubb",
        "position": "RB"
    },
    {
        "playerName": "Derrick Henry",
        "position": "RB"
    },
    {
        "playerName": "Justin Jefferson",
        "position": "WR"
    },
    {
        "playerName": "Cleveland Defense",
        "position": "DEF"
    }
];

type AuctionProps = {};
export class Auction extends React.Component<AuctionProps> {
    constructor(props: AuctionProps) {
        super(props);
    }

    render() {
        return (
            <div className="auction">
                <h2>Submit Your Bids</h2>
                <div className="auctionSectionContainer">
                    <AuctionPositionSection position="QB" players={this.getPlayersByPosition("QB")} />
                    <AuctionPositionSection position="WR" players={this.getPlayersByPosition("WR")} />
                    <AuctionPositionSection position="RB" players={this.getPlayersByPosition("RB")} />
                    <AuctionPositionSection position="TE" players={this.getPlayersByPosition("TE")} />
                    <AuctionPositionSection position="K" players={this.getPlayersByPosition("K")} />
                    <AuctionPositionSection position="DEF" players={this.getPlayersByPosition("DEF")} />
                </div>
            </div>
        );
    }

    getPlayersByPosition(position: string) {
        return data.filter((player) => {
            return player.position === position;
        }).map((player) => {
            return player.playerName;
        });
    }
}

// ----------------------------------------------

type AuctionPositionSectionProps = {
    position: string,
    players: string[]
};
class AuctionPositionSection extends React.Component<AuctionPositionSectionProps> {
    playerCardElements: JSX.Element[];
    constructor(props: AuctionPositionSectionProps) {
        super(props);

        this.playerCardElements = this.props.players.map((player) => {
            return <AuctionPlayerCard playerName={player} key={player} />
        });
    }

    render() {
        return (
            <div className="auctionPositionSection">
                <h3 className="positionTitle">{this.props.position}</h3>
                <div className="auctionPlayerCardContainer">
                    {this.playerCardElements.length > 0 ? this.playerCardElements : <p className="noPlayers">No players.</p>}
                </div>
            </div>
        );
    }
}

// ----------------------------------------------

type AuctionPlayerCardProps = {
    playerName: string
}
class AuctionPlayerCard extends React.Component<AuctionPlayerCardProps> {
    constructor(props: AuctionPlayerCardProps) {
        super(props);
    }

    render() {
        return (
            <div className="auctionPlayerCard">
                <p><strong>{this.props.playerName}</strong></p>
                <p><a href="/history">See past auctions</a></p>
                <label>Your Bid: $
                    <input type="number" placeholder="0" />
                </label>
            </div>
        );
    }
}