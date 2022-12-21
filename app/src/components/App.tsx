
import { Route, Routes } from 'react-router-dom';

import './App.css'
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
        <Main />
      </header>

    </div>
  );
}

// component containing the main page content
function Main() {
    return (
        <Routes>
            <Route index element={<Auction />} />
            <Route path='/history' element={<AuctionHistory />} />
        </Routes>
    );
}
