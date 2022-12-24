// Component that contains the auction form

import './Auction.css'

import React from "react";

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
                    <AuctionPositionSection position="QB" />
                    <AuctionPositionSection position="WR" />
                    <AuctionPositionSection position="RB" />
                    <AuctionPositionSection position="TE" />
                    <AuctionPositionSection position="K" />
                    <AuctionPositionSection position="DEF" />
                </div>
            </div>
        );
    }
}

// ----------------------------------------------

type AuctionPositionSectionProps = {
    position: string
};
class AuctionPositionSection extends React.Component<AuctionPositionSectionProps> {
    constructor(props: AuctionPositionSectionProps) {
        super(props);
    }

    render() {
        return (
            <div className="auctionPositionSection">
                <h3>{this.props.position}</h3>
                <AuctionPlayerCard playerName="Nick Chubb" />
                <AuctionPlayerCard playerName="Justin Jefferson" />
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