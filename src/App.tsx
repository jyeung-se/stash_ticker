import React from 'react';
import logo from './logo.svg';
import './App.css';
import background from './BlueVectorBackground.jpg';
import Stockdata from './Stockdata'
import Homepage from './Homepage'
import Mystash from './Mystash'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const App = () => {


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<Stockdata />} />
          <Route path="/mystash" element={<Mystash />} />
        </Routes>
      </BrowserRouter>
    </div>
  );

}

export default App;
