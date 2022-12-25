// Component that contains admin page

import './Admin.css'

import React from "react";

const seasons = [
    "2022-2023",
    "2021-2022"
]

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

type AdminProps = {};
type AdminState = {
    season: string
};
export class Admin extends React.Component<AdminProps, AdminState> {
    constructor(props: any) {
        super(props);

        this.state = {
            season: seasons[0]
        };

        this.handleSeasonChange = this.handleSeasonChange.bind(this);
    }

    handleSeasonChange(season: string) {
        this.setState({season: season});
    }

    render() {
        return (
            <div id="admin">
                <h2>Admin Settings</h2>
                <AdminSeasonSelect season={this.state.season} updateSeason={this.handleSeasonChange}/>
                <div id="adminSettings">
                    <ManageManagers season={this.state.season} />
                </div>
            </div>
        );
    }
}

// ----------------------------------------------

type AdminSeasonSelectProps = {
    season: string,
    updateSeason: {(season: string) : void}
};
class AdminSeasonSelect extends React.Component<AdminSeasonSelectProps> {
    constructor(props: AdminSeasonSelectProps) {
        super(props);

        this.handleSeasonChange = this.handleSeasonChange.bind(this);
    }

    handleSeasonChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.props.updateSeason(event.target.value);
    }

    render() {
        return (
            <div id="adminSeasonSelect">
                <select value={this.props.season} onChange={this.handleSeasonChange}>
                    {this.getSeasons()}
                </select>
            </div>
        );
    }

    getSeasons() {
        const currentSeason = seasons[0];
        return [
            <option value={currentSeason} key={currentSeason}>{currentSeason} (Current)</option>,
            ...seasons.slice(1).map(season =>
                <option value={season} key={season}>{season}</option>
            )
        ];
    }
}

// ----------------------------------------------

type ManageManagersProps = {
    season: string
};
class ManageManagers extends React.Component<ManageManagersProps> {
    constructor(props: ManageManagersProps) {
        super(props);
    }

    render() {
        return (
            <div id="manageManagers">
                <h4><strong>Manage Managers</strong></h4>
                <table>
                    <tbody>
                        {this.getManagers()}
                        <tr>
                            <td><span className="clickableSpan">+ Add New Player</span></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    getManagers() {
        return managers[this.props.season].map(manager =>
            <tr key={manager}>
                <td>{manager}</td>
                <td><span className="clickableSpan">rename</span></td>
                <td><span className="clickableSpan">delete</span></td>
            </tr>
        );
    }
}