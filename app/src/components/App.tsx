import Header from './Header';
import './App.css'

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
    </div>
  );
}
