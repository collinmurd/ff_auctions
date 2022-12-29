// Component that contains admin page

import './Admin.css'

import React from "react";

import { Modal } from './SharedComponents';

const currentSeason = "2022-2023"; // can be null. that would indicate there is no current season
const currentWeek = 14; // can be null. indicates same as above
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
            settings.push(<EndSeasonSetting key="endSeasonSetting" />);
            if (existingAuction) {
                settings.push(<EndAuctionSetting key="endAuctionSetting" />);
            } else {
                // settings.push(<button key="createAuctionSetting" id="createAuctionButton" className="button">Create New Auction</button>);
                settings.push(<CreateAuctionSetting key="createAuctionSetting" />);
            }
        } else {
            settings.push(<CreateSeasonSetting key="createSeasonSetting" />)
        }

        return settings;
    }
}

// ----------------------------------------------

function SeasonInfo(props: {season: string | null, week: number | null}) {
    if (props.season) {
        return (
            <div id="seasonInfo" className="settingSection">
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
    modalActive: boolean,
    seasonInput: string,
    managerInputs: string[]
}
class CreateSeasonSetting extends React.Component<{}, CreateSeasonSettingState> {
    constructor(props: any) {
        super(props);

        this.state = {
            modalActive: false,
            seasonInput: "",
            managerInputs: [""]
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleCreateSeason = this.handleCreateSeason.bind(this);
        this.handleSeasonInputChange = this.handleSeasonInputChange.bind(this);
        this.handleManagerInputChange = this.handleManagerInputChange.bind(this);
        this.handleAddAnotherManagerClick = this.handleAddAnotherManagerClick.bind(this);
        this.handleRemoveManagerClick = this.handleRemoveManagerClick.bind(this);
        this.handleSubmitNewSeason = this.handleSubmitNewSeason.bind(this);
    }

    toggleModal() {
        this.setState({modalActive: !this.state.modalActive});
    }

    handleCreateSeason() {
        this.toggleModal();
    }

    handleSeasonInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({seasonInput: event.target.value});
    }

    handleManagerInputChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        this.setState(prevState => {
            if (index < prevState.managerInputs.length) {
                prevState.managerInputs[index] = event.target.value;
            }
            return prevState;
        });
    }

    handleAddAnotherManagerClick(event: any) {
        this.setState(prevState => {
            return {managerInputs: [...prevState.managerInputs, ""]};
        });
        event.preventDefault();
    }

    handleRemoveManagerClick(event: any, index: number) {
        this.setState(prevState => {
            // using filter() because splice() changes the underlying array object
            // react in strict mode calls setState twice, so splice() was deleting two inputs
            return {managerInputs: prevState.managerInputs.filter((_, i) => i !== index)};
        })
        event.preventDefault();
    }

    handleSubmitNewSeason(event: any) {
        this.toggleModal();
        event.preventDefault();
    }

    render() {
        return (
            <div id="createSeason" className="settingSection">
                <button id="createSeasonButton" className="button" onClick={this.handleCreateSeason}>Start a new Season</button>
                <Modal active={this.state.modalActive} toggle={this.toggleModal} >
                    <h2>Start a new season</h2>
                    <form>
                        <div>
                            <h5>What NFL Season is it? (i.e. "2019-2020"):</h5>
                            <input
                                type="text"
                                value={this.state.seasonInput}
                                onChange={this.handleSeasonInputChange}
                                placeholder="2019-2020" />
                        </div>
                        <div id="managerInput">
                            <h5>Input Manager names:</h5>
                            {this.managerInputs()}
                            <div>
                                <button id="addAnotherManagerButton" className="addRowButton button" onClick={this.handleAddAnotherManagerClick}>+ Add Another Manager</button>
                            </div>
                        </div>
                        <div className="submitButtonContainer">
                            <button className="button" onClick={this.handleSubmitNewSeason}>Start Season</button>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    }

    managerInputs() {
        let inputs: JSX.Element[] = [];
        for (let i = 0; i < this.state.managerInputs.length; i++) {
            inputs.push(
                <div key={i} className="managerInputRow inputRow">
                    <input
                        type="text"
                        className="managerInputField"
                        value={this.state.managerInputs[i]}
                        onChange={(e) => this.handleManagerInputChange(e, i)}
                        placeholder="Firstname Lastname" />
                    <button className="removeManagerButton removeRowButton button" onClick={(e) => this.handleRemoveManagerClick(e, i)}>&#10006;</button>
                </div>
            );
        } 
        return inputs;
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
            <div id="endSeason" className="settingSection">
                <button id="endSeasonButton" className="button" onClick={this.handleEndSeason}>End Current Season</button>
                <Modal active={this.state.modalActive} toggle={this.toggleModal} >
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
                <Modal active={this.state.modalActive} toggle={this.toggleModal} >
                    <p>Are you sure you'd like to end the ongoing aution? This prevent further bids and progress the week.</p>
                </Modal>
            </div>
        );
    }
}

// ----------------------------------------------

type CreateAuctionSettingState = {
    modalActive: boolean,
    playerInputs: {name: string, position: string}[]
};
class CreateAuctionSetting extends React.Component<{}, CreateAuctionSettingState> {
    constructor(props: any) {
        super(props);

        this.state = {
            modalActive: false,
            playerInputs: [{name: '', position: 'QB'}]
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleNameInputChange = this.handleNameInputChange.bind(this);
        this.handlePositionInputChange = this.handlePositionInputChange.bind(this);
        this.handleAddPlayer = this.handleAddPlayer.bind(this);
        this.handleRemovePlayer = this.handleRemovePlayer.bind(this);
        this.handleSubmitNewAuction = this.handleSubmitNewAuction.bind(this);
    }

    toggleModal() {
        this.setState({modalActive: !this.state.modalActive});
    }

    handleNameInputChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        this.setState(prevState => {
            prevState.playerInputs[index].name = event.target.value;
            return {playerInputs: prevState.playerInputs};
        });
    }

    handlePositionInputChange(event: React.ChangeEvent<HTMLSelectElement>, index: number) {
        this.setState(prevState => {
            prevState.playerInputs[index].position = event.target.value;
            return {playerInputs: prevState.playerInputs};
        });
    }

    handleAddPlayer(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        this.setState(prevState => {
            return {playerInputs: [...prevState.playerInputs, {name: "", position: ""}]};
        });
        event.preventDefault();
    }

    handleRemovePlayer(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) {
        this.setState(prevState => {
            // using filter() because splice() changes the underlying array object
            // react in strict mode calls setState twice, so splice() was deleting two inputs
            return {playerInputs: prevState.playerInputs.filter((_, i) => i !== index)};
        })
        event.preventDefault();
    }

    handleSubmitNewAuction(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        this.toggleModal();
        event.preventDefault();
    }

    render() {
        return (
            <div id="createAuction" className="settingSection">
                <button id="createAuctionButton" className="button" onClick={this.toggleModal}>Create New Auction</button>
                <Modal active={this.state.modalActive} toggle={this.toggleModal} >
                    <form>
                        <p>Please list the players up for auction and their position.</p>
                        <div id="playerInputs">
                            {this.playerInputs()}
                            <div>
                                <button id="addAnotherPlayerButton" className="addRowButton button" onClick={this.handleAddPlayer}>+ Add Another Player</button>
                            </div>
                        </div>
                        <div className="submitButtonContainer">
                            <button className="button" onClick={this.handleSubmitNewAuction}>Start Auction</button>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    }

    playerInputs() {
        let inputs: JSX.Element[] = [];

        this.state.playerInputs.forEach((input, i) => {
            inputs.push(
                <div key={i} className="playerInput">
                    <input
                        value={input.name}
                        type="text"
                        placeholder="Player Name"
                        onChange={(e) => this.handleNameInputChange(e, i)} />
                    <select value={input.position} onChange={(e) => this.handlePositionInputChange(e, i)}>
                        <option value="QB">QB</option>
                        <option value="RB">RB</option>
                        <option value="WR">WR</option>
                        <option value="TE">TE</option>
                        <option value="K">K</option>
                        <option value="DEF">DEF</option>
                    </select>
                    <button className="removePlayerInput removeRowButton button" onClick={(e) => {this.handleRemovePlayer(e, i)}}>&#10006;</button>
                </div>
            );
        });

        return inputs;
    }
}