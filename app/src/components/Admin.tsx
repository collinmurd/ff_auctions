// Component that contains admin page

import './Admin.css'

import React from "react";

const currentSeason = "2022-2023";

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

const currentWeek = 4;
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
                <h4>Current Season: {currentSeason}</h4>
            </div>
        );
    }
}
