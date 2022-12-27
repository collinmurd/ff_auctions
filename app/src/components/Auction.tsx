// Component that contains the auction form

import './Auction.css'

import React, { MouseEventHandler } from "react";
import { Modal } from './SharedComponents';

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

type Bid = {
    playerName: string,
    amount: number
};

type AuctionProps = {};
type AuctionState = {
    modalActive: boolean,
    bids: Bid[]
};
export class Auction extends React.Component<AuctionProps, AuctionState> {
    positions: string[];
    constructor(props: AuctionProps) {
        super(props);

        this.state = {
            modalActive: false,
            bids: data.map(player => {
                return {playerName: player.playerName, amount: 0}
            })
        };

        this.positions = ["QB", "WR", "RB", "TE", "K", "DEF"];

        this.toggleModal = this.toggleModal.bind(this);
        this.setBids = this.setBids.bind(this);
    }

    toggleModal() {
        this.setState({modalActive: !this.state.modalActive});
    }

    setBids(bid: Bid) {
        console.log(`bid change: ${JSON.stringify(bid)}`)
        this.setState(prevState => {
            for (let i = 0; i < prevState.bids.length; i++) {
                if (prevState.bids[i].playerName == bid.playerName) {
                    prevState.bids[i].amount = bid.amount;
                    return {bids: prevState.bids};
                }
            }
            return {bids: [...prevState.bids, bid]};
        });
    }

    render() {
        return (
            <div className="auction">
                <h2>Submit Your Bids</h2>
                <div className="auctionSectionContainer">
                    {this.getAuctionPositionSections()}
                </div>
                <button id="auctionSubmit" className="button" onClick={this.toggleModal}>Submit</button>
                <Modal active={this.state.modalActive} toggle={this.toggleModal} exitButtonText="Confirm">
                    <div id="auctionSubmitModalContents">
                        <h2>Confirm your bids:</h2>
                        <ul>
                            {this.getBids()}
                        </ul>
                    </div>
                </Modal>
            </div>
        );
    }

    getBids() {
        return this.state.bids
        .filter(bid => bid.amount > 0)
        .map(bid => {
            return <li key={bid.playerName}>{bid.playerName}: ${bid.amount}</li>
        })
    }

    getAuctionPositionSections() {
        return this.positions.map(position => {
            return (
                <AuctionPositionSection
                    position={position}
                    players={this.getPlayersByPosition(position)}
                    bidUpdate={this.setBids}
                    key={position}
                />
            )
        });
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
    players: string[],
    bidUpdate: {(bid: Bid): void}
};
class AuctionPositionSection extends React.Component<AuctionPositionSectionProps> {
    playerCardElements: JSX.Element[];
    constructor(props: AuctionPositionSectionProps) {
        super(props);

        this.playerCardElements = this.props.players.map((player) => {
            return <AuctionPlayerCard playerName={player} key={player} bidUpdate={this.props.bidUpdate} />
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
    playerName: string,
    bidUpdate: {(bid: Bid): void}
}
class AuctionPlayerCard extends React.Component<AuctionPlayerCardProps> {
    constructor(props: AuctionPlayerCardProps) {
        super(props);

        this.handleBidUpdate = this.handleBidUpdate.bind(this);
    }

    handleBidUpdate(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.bidUpdate({
            playerName: this.props.playerName,
            amount: parseInt(event.target.value)
        });
    }

    render() {
        return (
            <div className="auctionPlayerCard">
                <p><strong>{this.props.playerName}</strong></p>
                <p><a href="/history">See past auctions</a></p>
                <label>Your Bid: $
                    <input type="number" placeholder="0" onChange={this.handleBidUpdate} />
                </label>
            </div>
        );
    }
}
