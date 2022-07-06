import React from 'react';
import logo from './logo.svg';
import './App.css';
import Stockdata from './Stockdata'

function App() {

  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          My money don't jiggle jiggle, it folds
        </p>
        <a>
          Welcome to StashTicker \n
        </a>
        <Stockdata/>
      </header>
    </div>
  );
}

export default App;
