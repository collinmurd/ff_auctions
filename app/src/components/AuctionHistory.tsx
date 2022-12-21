// Component that contains the auction history data

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
]

type AuctionHistoryTypes = {

};

export class AuctionHistory extends React.Component<AuctionHistoryTypes> {
    constructor(props: AuctionHistoryTypes) {
        super(props);
    }

    render() {
        return (
            <h2>This is where the Auction History data will go</h2>
        )
    }
}