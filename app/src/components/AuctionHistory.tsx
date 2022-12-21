// Component that contains the auction history data

import './AuctionHistory.css'

import React from "react";

const managersData = [
    {manager: 'Collin', cashRemaining: 420, weekEliminated: -1},
    {manager: 'Spencer', cashRemaining: 250, weekEliminated: -1},
    {manager: 'Nick', cashRemaining: 100, weekEliminated: 1}
]

const auctionsData = [
    {
        week: 1,
        wins: [
            {manager: 'Collin', player: 'Cooper Kupp', amount: 400},
            {manager: 'Nick', player: 'Justin Jefferson', amount: 900},
        ]
    },
    {
        week: 2,
        wins: [
            {manager: 'Collin', player: 'Nick Chubb', amount: 180},
            {manager: 'Spencer', player: 'Justin Jefferson', amount: 500},
            {manager: 'Spencer', player: 'Tyreek Hill', amount: 250}
        ]
    },
];

type AuctionHistoryTypes = {

};

export class AuctionHistory extends React.Component<AuctionHistoryTypes> {
    constructor(props: AuctionHistoryTypes) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>Auction History</h2>
                <table>
                    <tr>
                        <th></th>
                        <WeekSquare week={1} />
                        <WeekSquare week={2} />
                    </tr>
                    <tr>
                        <ManagerSquare name="Collin" cashRemaining={420}/>
                        <WinSquare manager="Collin" players={[{name: "Cooper Kupp", amount: 400}]}/>
                        <WinSquare manager="Collin" players={[{name: "Nick Chubb", amount: 180}]}/>
                    </tr>
                    <tr>
                        <ManagerSquare name="Spencer" cashRemaining={250}/>
                        <td></td>
                        <WinSquare manager="Spencer" players={[{name: "Justin Jefferson", amount: 500}, {name: "Tyreek Hill", amount: 200}]}/>
                    </tr>
                    <tr>
                        <ManagerSquare name="Nick" cashRemaining={100}/>
                        <WinSquare manager="Nick" players={[{name: "Justin Jefferson", amount: 900}]}/>
                        <td></td>
                    </tr>
                </table>
            </div>
        );
    }
}

// ----------------------------------------------

function WeekSquare(props: {week: number}) {
    return (
        <th>
            <p>Week</p>
            <p>{props.week}</p>
        </th>
    );
}

// ----------------------------------------------

function ManagerSquare(props: {name: string, cashRemaining: number}) {
    return (
        <th>
            <h5>{props.name}</h5>
            <p>Cash: ${props.cashRemaining}</p>
        </th>
    );
}

// ----------------------------------------------

type WinSquareProps = {
    manager: string,
    players: {name: string, amount: number}[]
}
function WinSquare(props: WinSquareProps) {
    const playerList = props.players.map((player) =>
        <li key={player.name}>
            <p className="win-player-name">{player.name}</p>
            <p className="win-player-amount">{player.amount}</p>
        </li>
    );
    return (
        <td>
            <ul>{playerList}</ul>
        </td>
    );
}