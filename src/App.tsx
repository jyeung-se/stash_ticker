import React from 'react';
import logo from './logo.svg';
import './App.css';
import background from './BlueVectorBackground.jpg';
import Stockdata from './Stockdata'

function App() {

  
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <a>
          Welcome to StashTicker
        </a>
        <Stockdata/>
      </header>
    </div>
  );
}

export default App;
