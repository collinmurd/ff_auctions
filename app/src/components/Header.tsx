import React from "react";
import './Header.css';

type HeaderProps = {
    user: {
        name: string,
        balance: number
    }
}

// For state typing, do the following: 
// class Header extends React.Component<HeaderProps, HeaderState> {
// https://stackoverflow.com/questions/47561848/property-value-does-not-exist-on-type-readonly
class Header extends React.Component<HeaderProps> {
    constructor(props: HeaderProps) {
        super(props);
    }

    render() {
        return (
            <div className="header">
                <h1 className="title">Auction Portal</h1>
                <div className="userInfo">
                    <h3>{this.props.user.name}</h3>
                    <h5>Cash Remaining: ${this.props.user.balance}</h5>
                </div>
            </div>
        );
    }
}

export default Header;