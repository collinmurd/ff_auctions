import React from "react";
import './Header.css';

// props: {
//     user: {
//         name: 'user name'
//         balance: balance remaining
//     }
// }
class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="header">
                <h1 class="title">Auction Portal</h1>
                <div class="userInfo">
                    <h3>{this.props.user.name}</h3>
                    <h5>Cash Remaining: ${this.props.user.balance}</h5>
                </div>
            </div>
        );
    }
}

export default Header;