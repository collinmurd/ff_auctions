// Component that contains admin page

import './Admin.css'

import React from "react";

import { Modal } from './SharedComponents';

const currentSeason = null; // can be null. that would indicate there is no current season
const currentWeek = null; // can be null. indicates same as above
const existingAuction = false;

type AdminProps = {};
type AdminState = {
    endSeasonModalActive: boolean
};
export class Admin extends React.Component<AdminProps, AdminState> {
    constructor(props: any) {
        super(props);

        this.state = {
            endSeasonModalActive: false
        }
    }

    render() {

        return (
            <div id="admin">
                <h2>Administration</h2>
                <SeasonInfo season={currentSeason} week={currentWeek} />
                <div className="settingContainer">{this.settings()}</div>
            </div>
        );
    }

    settings() {
        let settings: JSX.Element[] = [];
        if (currentSeason) {
            settings.push(<EndSeasonSetting />);
            if (existingAuction) {
                settings.push(<EndAuctionSetting />);
            } else {
                settings.push(<button id="createAuctionButton" className="button">Create New Auction</button>);
            }
        } else {
            settings.push(<CreateSeasonSetting />)
        }

        return settings;
    }
}

// ----------------------------------------------

function SeasonInfo(props: {season: string | null, week: number | null}) {
    if (props.season) {
        return (
            <div id="seasonInfo">
                <h4>Current Season: {props.season}</h4>
                <h4>Current Week: {props.week}</h4>
            </div>
        )
    } else {
        return (
            <div id="seasonInfo">
                <h4>No Current Season</h4>
            </div>
        )
    }
}

// ----------------------------------------------

type CreateSeasonSettingState = {
    modalActive: boolean
}
class CreateSeasonSetting extends React.Component<{}, CreateSeasonSettingState> {
    constructor(props: any) {
        super(props);

        this.state = {
            modalActive: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleCreateSeason = this.handleCreateSeason.bind(this);
    }

    toggleModal() {
        this.setState({modalActive: !this.state.modalActive});
    }

    handleCreateSeason() {
        this.toggleModal();
    }

    render() {
        return (
            <div id="endSeason">
                <button id="endSeasonButton" className="button" onClick={this.handleCreateSeason}>Start a new Season</button>
                <Modal active={this.state.modalActive} toggle={this.toggleModal} exitButtonText="Confirm">
                    <h2>Start a new Season</h2>
                </Modal>
            </div>
        );
    }
}

// ----------------------------------------------

type EndSeasonSettingState = {
    modalActive: boolean
}
class EndSeasonSetting extends React.Component<{}, EndSeasonSettingState> {
    constructor(props: any) {
        super(props);

        this.state = {
            modalActive: false
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleEndSeason = this.handleEndSeason.bind(this);
    }

    toggleModal() {
        this.setState({modalActive: !this.state.modalActive});
    }

    handleEndSeason() {
        this.toggleModal();
    }

    render() {
        return (
            <div id="endSeason">
                <button id="endSeasonButton" className="button" onClick={this.handleEndSeason}>End Current Season</button>
                <Modal active={this.state.modalActive} toggle={this.toggleModal} exitButtonText="Confirm">
                    <p>Are you sure you'd like to end this season?</p>
                </Modal>
            </div>
        );
    }
}

// ----------------------------------------------

type EndAuctionSettingState = {
    modalActive: boolean
}
class EndAuctionSetting extends React.Component<{}, EndAuctionSettingState> {
    constructor(props: any) {
        super(props);

        this.state = {
            modalActive: false
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleEndAuction = this.handleEndAuction.bind(this);
    }

    toggleModal() {
        this.setState({modalActive: !this.state.modalActive});
    }

    handleEndAuction() {
        this.toggleModal();
    }

    render() {
        return (
            <div id="endAuction">
                <button id="endAuctionButton" className="button" onClick={this.handleEndAuction}>End Current Auction</button>
                <Modal active={this.state.modalActive} toggle={this.toggleModal} exitButtonText="Confirm">
                    <p>Are you sure you'd like to end the ongoing aution? This prevent further bids and progress the week.</p>
                </Modal>
            </div>
        );
    }
}