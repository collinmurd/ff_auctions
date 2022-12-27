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
            settings.push(<EndSeasonSetting key="endSeasonSetting" />);
            if (existingAuction) {
                settings.push(<EndAuctionSetting key="endAuctionSetting" />);
            } else {
                settings.push(<button key="createAuctionSetting" id="createAuctionButton" className="button">Create New Auction</button>);
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
        console.log(`index: ${index}`)
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
            <div id="endSeason">
                <button id="endSeasonButton" className="button" onClick={this.handleCreateSeason}>Start a new Season</button>
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
                                <button id="addAnotherManagerButton" className="button" onClick={this.handleAddAnotherManagerClick}>+ Add Another Manager</button>
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
                <div key={i} className="managerInputRow">
                    <input
                        type="text"
                        className="managerInputField"
                        value={this.state.managerInputs[i]}
                        onChange={(e) => this.handleManagerInputChange(e, i)}
                        placeholder="Firstname Lastname" />
                    <button className="removeManagerButton button" onClick={(e) => this.handleRemoveManagerClick(e, i)}>&#10006;</button>
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
            <div id="endSeason">
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