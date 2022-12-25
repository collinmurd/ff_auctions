// Component that contains admin page

import './Admin.css'

import React from "react";

const seasons = [
    "2022-2023",
    "2021-2022"
]

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