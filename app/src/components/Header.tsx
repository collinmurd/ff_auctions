// component that contains the header (including nav)

import { NavLink } from 'react-router-dom';
import React from "react";
import './Header.css';

// ----------------------------------------------

class Nav extends React.Component {
    render () {
        return <nav>
            <ul>
                <li><NavLink to='/'>Submit Bids</NavLink></li>
                <li><NavLink to='/history'>Auction History</NavLink></li>
                <li><NavLink to='/admin'>Admin</NavLink></li>
            </ul>
        </nav>
    }
}

// ----------------------------------------------

type HeaderProps = {
    user: {
        name: string,
        balance: number
    }
};

// For state typing, do the following: 
// class Header extends React.Component<HeaderProps, HeaderState> {
// https://stackoverflow.com/questions/47561848/property-value-does-not-exist-on-type-readonly
export class Header extends React.Component<HeaderProps> {
    constructor(props: HeaderProps) {
        super(props);
    }

    render() {
        return (
            <div className="header">
                <div>
                    <h1 className="title">Auction Portal</h1>
                    <div className="userInfo">
                        <h3>{this.props.user.name}</h3>
                        <h5>Remaining Cash: ${this.props.user.balance}</h5>
                    </div>
                </div>
                <Nav />
            </div>
        );
    }
}
