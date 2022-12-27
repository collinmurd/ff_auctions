// Modal component

import './SharedComponents.css'

import React, {MouseEventHandler} from "react";

type ModalProps = {
    active: boolean,
    exitButtonText: string,
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
                    {this.props.children}
                    <div className="modalExitContainer">
                        <button className="modalExit button" onClick={this.props.toggle}>{this.props.exitButtonText}</button>
                    </div>
                </div>
            </div>
        )
    }
}
