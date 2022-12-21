// Component that contains the auction form

import React from "react";

type AuctionTypes = {

};

export class Auction extends React.Component<AuctionTypes> {
    constructor(props: AuctionTypes) {
        super(props);
    }

    render() {
        return (
            <h2>This is where the Auction form will go</h2>
        )
    }
}