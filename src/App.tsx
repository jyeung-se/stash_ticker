import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from './logo.svg';
import './App.css';
import background from './BlueVectorBackground.jpg';
import Stockdata from './Stockdata'
import Homepage from './Homepage'
import Mystash from './Mystash'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Table } from 'antd';
// import type { ColumnsType } from 'antd/lib/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SearchBar from './SearchBar'
import type { ColumnsType } from 'antd/es/table';


const App = () => {


  const [error, setError] = useState(null)
  const [stockTickers, setStockTickers] = useState<any>([])
  const [allStocks, setAllStocks] = useState<any>([])
  const [stockResults, setStockResults] = useState<any>([])
  const [stockHourlyResults, setStockHourlyResults] = useState<any>([])
  const [mostRecentSearch, setMostRecentSearch] = useState('')
  const [stockStash, setStockStash] = useState<any>([])
  const [allStocksTableVisability, setAllStocksTableVisability] = useState(true)
 
  

    // // API Calls for ALL stocks
    useEffect(() => {
      //Each API key has 250 free daily api calls, replace key with the other if hit cap for calls. 
      //API key#1: 4672ed38f1e727b95f8a9cbd22574eed -gmail
      //API key#2: 82c67b0e070a79fd0ab79b7b1987b6ba -yahoo
      //Endpoint = Symbols List
      axios.get('https://financialmodelingprep.com/api/v3/stock/list?apikey=82c67b0e070a79fd0ab79b7b1987b6ba').then(async (res) => {
          const stockData = await res.data
          // console.log('stockData[0]:', stockData[0]);
          setAllStocks(stockData)
          const listOfStockTickers = stockData.map((ticker: any) => ticker.symbol)
          // console.log('list of stock tickers is: ', listOfStockTickers)
          setStockTickers(listOfStockTickers)
      }).catch((error) => {
          console.error(error);
      });
  }, [])
  



    const unstash = () => {
        stockStash.filter((stock: any) => {
            return stock.symbol !== stock.symbol
        })
    }


    interface TableDataType {
        key: React.Key;
        name: string;
        symbol: string;
        price: number;
        eps: string;
        dayHigh: number;
        dayLow: number;
        change: number;
        date: string;
        open: number;
        low: number;
        high: number;
        close: number;
        volume: number;
      }


    const myStashColumns: ColumnsType<TableDataType> = [
    {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol'
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price'
    },
    {
        title: 'EPS',
        dataIndex: 'eps',
        key: 'eps'
    },
    {
        title: 'DayHigh',
        dataIndex: 'dayHigh',
        key: 'dayHigh'
    },
    {
        title: 'DayLow',
        dataIndex: 'dayLow',
        key: 'dayLow'
    },
    {
        title: 'Change',
        dataIndex: 'change',
        key: 'change'
    },
    {
        title: 'Unstash',
        dataIndex: 'unstash',
        key: 'unstash',
        render: Unstash => <button onClick={() => unstash}>Remove</button>
    }
    ];
      

    const snapshotColumns: ColumnsType<TableDataType> = [
    {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol'
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price'
    },
    {
        title: 'EPS',
        dataIndex: 'eps',
        key: 'eps'
    },
    {
        title: 'DayHigh',
        dataIndex: 'dayHigh',
        key: 'dayHigh'
    },
    {
        title: 'DayLow',
        dataIndex: 'dayLow',
        key: 'dayLow'
    },
    {
        title: 'Change',
        dataIndex: 'change',
        key: 'change'
    }
    ];


    const allStocksColumns: ColumnsType<TableDataType> = [
    {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol'
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price'
    },
    {
        title: 'Exchange',
        dataIndex: 'exchange',
        key: 'exchange'
    },
    {
        title: 'ExchangeShortName',
        dataIndex: 'exchangeShortName',
        key: 'exchangeShortName'
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type'
    }
    ];


    const hourlyColumns: ColumnsType<TableDataType> = [
        {
            title: 'Close',
            dataIndex: 'close',
            key: 'close'
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'High',
            dataIndex: 'high',
            key: 'high'
        },
        {
            title: 'Low',
            dataIndex: 'low',
            key: 'low'
        },
        {
            title: 'Open',
            dataIndex: 'open',
            key: 'open'
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume'
        }
        ];

    
      
    const snapshotTable = () => <Table className="flex-container" columns={snapshotColumns} dataSource={stockResults} />;
    const myStashTable = () => <Table className="flex-container" columns={myStashColumns} dataSource={stockStash} />;
    const allStocksTable = () => <Table className="flex-container" columns={allStocksColumns} dataSource={allStocks} />;
    const hourlyStockTable = () => <Table className="flex-container" columns={hourlyColumns} dataSource={stockHourlyResults} />; 


    const hourlyStockChart = () => {
        const dayOrNight = (hourInStringFormat: string) => {
            if (Number(hourInStringFormat) === 12) {
               return "12PM"
            } else if (Number(hourInStringFormat) > 12) { 
               return (Number(hourInStringFormat) - 12).toString() + "PM"
            } else {
               return Number(hourInStringFormat).toString() + "AM"
            }
        }

        const abridgedHourlyStockData = 
            stockHourlyResults.slice(0,12)
            .map((hourStat: any) => {
            return (
                {
                    date: dayOrNight(hourStat.date.substr(11, 2)),
                    low: hourStat.low,
                    high: hourStat.high,
                    open: hourStat.open,
                    close: hourStat.close,
                    volume: hourStat.volume
                }
            )
        })
        // console.log('abridgedHourlyStockData inside hourlyStockChart() is: ', abridgedHourlyStockData)


        return (
            <ResponsiveContainer width="99%" height={400}>
                <AreaChart
                    data={abridgedHourlyStockData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <XAxis dataKey="date" />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="high" stroke="#7d4ebf" fill="#7d4ebf" />
                    <Area type="monotone" dataKey="low" stroke="#9aeb67" fill="#9aeb67" />
                </AreaChart> 
            </ResponsiveContainer>
        )
    }



    const compareForSorting = (a: any, b: any) => {
        // console.log("compareForSorting fires off")
        if ( a.symbol < b.symbol ){
            return -1;
        }
        if ( a.symbol > b.symbol ){
            return 1;
        }
        return 0;
    }



    const addToStockStash = () => {
        // console.log('stockResults is: ', stockResults)
        // console.log('stockStash before updating is: ', stockStash)
        const listOfStockSymbolsInStash: any = () => {
            return stockStash.map((stock: any) => {
                return stock.symbol
            })
        }
        if (listOfStockSymbolsInStash().includes(stockResults[0].symbol)) {
            return alert('The stock has already been added to your Stash before. Please add a different stock instead.')
        }
        
        setStockStash([...stockStash, ...stockResults].sort(compareForSorting))
        console.log('stockStash AFTER updating is: ', stockStash)
    }



    const tablesShownPostSearch = () => {
        // console.log(mostRecentSearch, stockResults, stockHourlyResults)
        if (stockResults.length > 0) {
            return (
                <div>
                    <br></br>
                    <h2>My Stock Stash</h2>
                    {myStashTable()}
                    <br></br>
                    <h2>{stockResults[0].symbol} Profile</h2>
                    {snapshotTable()}
                    <button type="button" className="addToStockStashButton" onClick={addToStockStash}>Add to Stash</button>
                    <br></br>
                    <br></br>
                    {hourlyStockChart()}
                    <br></br>
                    <h2>{stockResults[0].symbol} Hourly Historicals</h2>
                    {hourlyStockTable()}
                    <br></br>
                </div>
            )
        }
    }   

    

    const toggleAllStocksTable = () => {
      setAllStocksTableVisability(!allStocksTableVisability)
      // console.log('stocktablevisibility state after toggle: ', AllStocksTableVisability)
    }

    const displayAllStocksTable = () => {
        return allStocksTableVisability === true ? <div><h2>All Companies</h2> <br></br> {allStocksTable()}</div> : null
    }


    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const handleSubmit = (e: any) => {
        e.preventDefault()
        setMostRecentSearch(mostRecentSearch)
        // console.log('searchQuery is: ', searchQuery)
        // console.log('mostRecentSearch is: ', mostRecentSearch)

        // console.log('stockTickers is: ', stockTickers)
        if (stockTickers.includes(mostRecentSearch)) {
            //Endpoint = Company Quote
            axios.get(`https://financialmodelingprep.com/api/v3/quote/${mostRecentSearch}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
            .then(async (res) => {
                const stockData = await res.data
                // console.log('stockData[0]:', stockData[0]);
                setStockResults(stockData)      
            }).catch((error) => {
                console.error(error);
            });

            //Endpoint = Historical Price   (hour historicals)
            axios.get(`https://financialmodelingprep.com/api/v3/historical-chart/1hour/${mostRecentSearch}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
            .then(async (res) => {
                const stockHourlyData = await res.data
                // console.log('stockHourlyData:', stockHourlyData);
                setStockHourlyResults(stockHourlyData)      
            }).catch((error) => {
                console.error(error);
            });

            setAllStocksTableVisability(false)
            displayAllStocksTable()

            e.target.reset()
        } else {
            alert("Please check to see if you have entered a correct stock symbol, then try again.")
            e.target.reset()
        }
        
    }
  


    if(error) {
        return <div>Error: {error}</div>
    }


    return (
         <div className="App">
                <br></br>
                <SearchBar handleSubmit={handleSubmit} setMostRecentSearch={setMostRecentSearch} mostRecentSearch={mostRecentSearch} />
                <br></br>
                <button onClick={toggleAllStocksTable}>Toggle List of All Companies</button>
                {displayAllStocksTable()}
                <br></br>
                {(stockResults.length || stockHourlyResults.length !== 0) ? tablesShownPostSearch() : null} 
                <br></br>
                {/* <h2>All Companies</h2>
                {allStocksTable()} */}
                <br></br>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Homepage />} />
                {/* <Route path="/" element={<SearchBar />} /> */}
                <Route path="/search" element={<Stockdata />} />
                <Route path="/mystash" element={<Mystash />} />
              </Routes>
            </BrowserRouter>            
        </div>
    )

}

export default App
