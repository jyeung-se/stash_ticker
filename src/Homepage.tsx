import Stockdata from './Stockdata'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function Homepage() {

    

    return (
        <div className="App">
            <header className="App-header">
                <a>
                    Welcome to StashTicker 
                    <br></br>
                    hello this is the homepage with search bar
                </a>
                <div className="search-wrapper">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                    }}>
                    {/* <form onSubmit={handleSubmit}> */}
                        <input type="text" onChange={(e) => {
                            return e
                            // setsearchQuery(e.target.value.toUpperCase())
                            // setMostRecentSearch(e.target.value.toUpperCase())}} 
                        }}
                            placeholder="Stock Symbol"/>
                        <input type="submit" value="Search" />
                    </form>                
                 </div>
            </header>
        </div>
    )

}