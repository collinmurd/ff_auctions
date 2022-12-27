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
                <div className="buttonContainer">{this.seasonSetting()}</div>
                <div className="buttonContainer">{this.auctionButton()}</div>
            </div>
        );
    }

    seasonSetting() {
        if (currentSeason)
            return <EndSeasonSetting />
        else
            return <button id="createSeasonButton" className="button">Create New Season</button>
    }

    auctionButton() {
        if (existingAuction)
            return <button id="endAuctionButton" className="button">End Current Auction</button>
        else
            return <button id="createAuctionButton" className="button">Create New Auction</button>
    }
}

// ----------------------------------------------

function SeasonInfo(props: {season: string | null, week: number | null}) {
    if (currentSeason) {
        return (
            <div id="seasonInfo">
                <h4>Current Season: {currentSeason}</h4>
                <h4>Current Week: {currentSeason}</h4>
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