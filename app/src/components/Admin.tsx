// Component that contains admin page

import './Admin.css'

import React from "react";

const managers: {[season: string]: string[]} = {
    "2022-2023": [
        "Collin",
        "Spencer",
        "Cyrus",
        "Ric"
    ],
    "2021-2022": [
        "Collin",
        "Spencer",
        "Nick"
    ]
}

const currentSeason = "2022-2023"; // can be null. that would indicate there is no current season
const currentWeek = 4; // can be null. indicates same as above
const existingAuction = false;

type AdminProps = {};
type AdminState = {
};
export class Admin extends React.Component<AdminProps, AdminState> {
    constructor(props: any) {
        super(props);

    }

    render() {
        return (
            <div id="admin">
                <h2>Administration</h2>
                <h4>
                    {currentSeason ? `Current Season: ${currentSeason}` : 'No Current Season'}
                </h4>
                <h4>
                    {currentWeek ? `Current Week: ${currentWeek}` : 'No Current Season'}
                </h4>
                <div className="buttonContainer">{this.seasonButton()}</div>
                <div className="buttonContainer">{this.auctionButton()}</div>
            </div>
        );
    }

    seasonButton() {
        if (currentSeason)
            return <button id="createSeasonButton" className="button">Create New Season</button>
        else
            return <button id="endSeasonButton" className="button">End Current Season</button>
    }

    auctionButton() {
        if (currentSeason)
            return <button id="createAuctionButton" className="button">Create New Auction</button>
        else
            return <button id="endAuctionButton" className="button">End Current Auction</button>
    }
}
