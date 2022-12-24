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

type AuctionHistoryProps = {};
const managerSortOptions = ['cashIncreasing', 'cashDecreasing', 'eliminatedIncreasing', 'eliminatedDecreastin'];
type AuctionHistoryState = {
    managerSort: string,
    playerFilter: string;
};

export class AuctionHistory extends React.Component<AuctionHistoryProps, AuctionHistoryState> {
    constructor(props: AuctionHistoryProps) {
        super(props);
        this.state = {
            managerSort: 'cashDecreasing',
            playerFilter: ''
        }
    }

    managerSortOnChange(value: string) {
        if (managerSortOptions.includes(value)) {
            this.setState({managerSort: value});
        }
    }

    playerFilterOnChange(value: string) {
        this.setState({playerFilter: value});
    }

    render() {
        return (
            <div className="auctionHistory">
                <h2>Auction History</h2>
                <div className="auctionTableAndInput">
                    <AuctionTableInput
                        managerSort={this.state.managerSort}
                        managerSortOnChange={this.managerSortOnChange}
                        playerFilter={this.state.playerFilter}
                        playerFilterOnChange={this.playerFilterOnChange} />
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

type AuctionTableInputProps = {
    managerSort: string,
    managerSortOnChange: Function,
    playerFilter: string,
    playerFilterOnChange: Function
};
class AuctionTableInput extends React.Component<AuctionTableInputProps> {
    constructor(props: AuctionTableInputProps) {
        super(props);

        this.handleManagerSortChange = this.handleManagerSortChange.bind(this);
        this.handlePlayerFilterChange = this.handlePlayerFilterChange.bind(this);
    }

    handleManagerSortChange(event: any) {
        this.props.managerSortOnChange(event.target.value);
    }

    handlePlayerFilterChange(event: any) {
        this.props.playerFilterOnChange(event.target.value);
    }

    render() {
        return (
            <form id="auctionTableInput">
                <label>Manager Sort:
                    <select className="auctionTableInputField" value={this.props.managerSort} onChange={this.handleManagerSortChange}>
                        <option value="cashDecreasing" selected>Remaining Cash Decreasing</option>
                        <option value="cashIncreasing">Remaining Cash Increasing</option>
                    </select>
                </label>
                <label>Player Filter:
                    <select className="auctionTableInputField" value={this.props.playerFilter} onChange={this.handlePlayerFilterChange}>
                        <option value="" selected></option>
                        {this.getAllPlayers()}
                    </select>
                </label>
            </form>
        );
    }

    getAllPlayers() {
        let allPlayers = new Set<JSX.Element>();
        Object.values(data).forEach((val) => {
            val.auctions.forEach((auction) => {
                for (let win of auction) {
                    allPlayers.add(
                        <option value={win.player} key={win.player}>{win.player}</option>
                    );
                }
            });
        });
        return Array.from(allPlayers);
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