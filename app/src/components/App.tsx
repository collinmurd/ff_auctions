
import { Route, Routes } from 'react-router-dom';

import './App.css'
import { Admin } from './Admin';
import { Auction } from './Auction';
import { AuctionHistory } from './AuctionHistory';
import { Header } from './Header';

const user = {
    name: 'Collin',
    balance: 420
};

export function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Header user={user} />
            </header>
            <div id="main">
                <Main />
            </div>
        </div>
    );
}

// component containing the main page content
function Main() {
    return (
        <Routes>
            <Route index element={<Auction />} />
            <Route path='/history' element={<AuctionHistory />} />
            <Route path='/admin' element={<Admin />} />
        </Routes>
    );
}
