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
export class AuctionPositionSection extends React.Component<AuctionPositionSectionProps> {
    constructor(props: AuctionPositionSectionProps) {
        super(props);
    }

    render() {
        return (
            <div className="auctionPositionSection">
                <h3>{this.props.position}</h3>
                <p>No players</p>
            </div>
        );
    }
}