// Component that contains the auction history data

import './AuctionHistory.css'

import React from "react";

const numberOfWeeks = 18;

const currentWeek = 4;

const data = {
    'Collin': {
        amountRemaining: 345,
        weekEliminated: null,
        auctions: [
            [
                {player: 'Tyreek Hill', amount: 400}
            ],
            [
                {player: 'Nick Chubb', amount: 400},
                {player: 'Justin Jefferson', amount: 500}
            ],
            [
                {player: 'Darren Waller', amount: 400}
            ]
        ]
    },
    'Nick': {
        amountRemaining: 90,
        weekEliminated: null,
        auctions: [
            [],
            [],
            [
                {player: 'Nick Chubb', amount: 400}
            ]
        ]
    },
    'Spencer': {
        amountRemaining: 400,
        weekEliminated: 2,
        auctions: [
            [
                {player: 'Justin Jefferson', amount: 700}
            ],
            [],
            []
        ]
    }
}

type AuctionHistoryTypes = {

};

export class AuctionHistory extends React.Component<AuctionHistoryTypes> {
    constructor(props: AuctionHistoryTypes) {
        super(props);
    }

    render() {
        return (
            <div className="auctionHistory">
                <h2>Auction History</h2>
                <div className="auctionTableAndInput">
                    <AuctionTableInput />
                    <div className="sidescrollTable">
                        <table>
                            <thead>{this.weekRow()}</thead>
                            <tbody>{this.managerRows()}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    weekRow() {
        let squares = [];
        for (let i = 1; i <= numberOfWeeks; i++) {
            squares.push(<WeekSquare key={i} week={i} />);
        }
        return (
            <tr>
                <th className="spacer-square"></th>
                {squares}
            </tr>
        );
    }

    managerRows() {
        let rows = [];
        for (let [manager, managerData] of Object.entries(data)) {
            let squares = [];
            for (let week = 1; week < currentWeek; week++) {
                if (managerData.weekEliminated && managerData.weekEliminated <= week) {
                    squares.push(<EliminatedSquare />)
                } else {
                    squares.push(<AliveSquare manager={manager} players={managerData.auctions[week - 1]}/>)
                }
            }
            rows.push(
                <tr>
                    <ManagerSquare name={manager} cashRemaining={managerData.amountRemaining} />
                    {squares}
                </tr>
            );
        }
        return rows;
    }
}

// ----------------------------------------------

type AuctionTableInputProps = {};
const managerSortOptions = ['cashIncreasing', 'cashDecreasing', 'eliminatedIncreasing', 'eliminatedDecreastin'];
type AuctionTableInputState = {
    managerSort: typeof managerSortOptions[number], // extract type from `managerSortOptions`
    playerFilter: string;
};
class AuctionTableInput extends React.Component<AuctionTableInputProps, AuctionTableInputState> {
    constructor() {
        super({});
        this.state = {
            managerSort: 'cashDecreasing',
            playerFilter: ''
        };

        this.handleManagerSortChange = this.handleManagerSortChange.bind(this);
        this.handlePlayerFilterChange = this.handlePlayerFilterChange.bind(this);
    }

    handleManagerSortChange(event: any) {
        this.setState({managerSort: event.target.value})
    }

    handlePlayerFilterChange(event: any) {
        this.setState({playerFilter: event.target.value})
    }

    render() {
        return (
            <form id="auctionTableInput">
                <label>Manager Sort:
                    <select className="auctionTableInputField" value={this.state.managerSort} onChange={this.handleManagerSortChange}>
                        <option value="cashDecreasing" selected>Remaining Cash Decreasing</option>
                        <option value="cashIncreasing" selected>Remaining Cash Increasing</option>
                    </select>
                </label>
                <label>Player Filter:
                    <input className="auctionTableInputField" type="text" onChange={this.handlePlayerFilterChange}/>
                </label>
            </form>
        );
    }
}

// ----------------------------------------------

function WeekSquare(props: {week: number}) {
    return (
        <th className="weekSquare">
            <p>Week</p>
            <p>{props.week}</p>
        </th>
    );
}

// ----------------------------------------------

function ManagerSquare(props: {name: string, cashRemaining: number}) {
    return (
        <th className="managerSquare">
            <h5>{props.name}</h5>
            <p>Remaining Cash: ${props.cashRemaining}</p>
        </th>
    );
}

// ----------------------------------------------

type AliveSquareProps = {
    manager: string,
    players: {player: string, amount: number}[]
}
function AliveSquare(props: AliveSquareProps) {
    const playerList = props.players.sort((player1, player2) => {
        return player2.amount - player1.amount;
    }).map((player) =>
        <li key={player.player}>
            <p className="win-player-name">{player.player}</p>
            <p className="win-player-amount">${player.amount}</p>
        </li>
    );
    return (
        <td className="aliveSquare">
            <ul>{playerList}</ul>
        </td>
    );
}

// ----------------------------------------------

function EliminatedSquare() {
    return (
        <td className="eliminatedSquare"></td>
    );
}