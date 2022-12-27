// Modal component

import './SharedComponents.css'

import React, {MouseEventHandler} from "react";

type ModalProps = {
    active: boolean,
    toggle: MouseEventHandler,
    children: React.ReactNode
};
export class Modal extends React.Component<ModalProps> {
    constructor(props: ModalProps) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.active? "modal modalActive": "modal"}>
                <div className="modalContent">
                    <div className="modalExitContainer">
                        <button className="modalExit button" onClick={this.props.toggle}>&#10006;</button>
                    </div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
