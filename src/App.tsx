import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';
import background from './BlueVectorBackground.jpg';
import Homepage from './Homepage'
import Mystash from './Mystash'
import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import { Table, Col, Divider, Row, Button, Radio } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SearchBar from './SearchBar'
import myStashColumns from './myStashColumns';
import snapshotColumns from './snapshotColumns';
import allStocksColumns from './allStocksColumns';
import timePeriodColumns from './timePeriodColumns';



const App = () => {


  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stockTickers, setStockTickers] = useState<any>([])
  const [allStocks, setAllStocks] = useState<any>([])
  const [stockResults, setStockResults] = useState<any>([])
  const [stockHourlyResults, setStockHourlyResults] = useState<any>([])
  const [mostRecentSearch, setMostRecentSearch] = useState('')
  const [stockStash, setStockStash] = useState<any>([])
  const [allStocksTableVisability, setAllStocksTableVisability] = useState(true)
  const [timePeriod, setTimePeriod] = useState('1D')
  const [stockTimePeriodResults, setStockTimePeriodResults] = useState<any>([])
  const [companyDescription, setCompanyDescription] = useState('')
 
  

    // // API Calls for ALL stocks
    useEffect(() => {
      //Each API key has 250 free daily api calls, replace key with the other if hit cap for calls. 
      //API key#1: 4672ed38f1e727b95f8a9cbd22574eed -gmail
      //API key#2: 82c67b0e070a79fd0ab79b7b1987b6ba -yahoo
      //Endpoint = Symbols List
      axios.get('https://financialmodelingprep.com/api/v3/stock/list?apikey=4672ed38f1e727b95f8a9cbd22574eed').then(async (res) => {
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


      
    const snapshotTable = () => <Table className="flex-container" columns={snapshotColumns} dataSource={stockResults} />;
    const myStashTable = () => <Table className="flex-container" columns={myStashColumns} dataSource={stockStash} />;
    const allStocksTable = () => <Table className="flex-container" columns={allStocksColumns} dataSource={allStocks} />;
    const hourlyStockTable = () => <Table className="flex-container" columns={timePeriodColumns} dataSource={stockHourlyResults} />; 
    const timePeriodStockTable = () => <Table className="flex-container" columns={timePeriodColumns} dataSource={stockTimePeriodResults} />; 


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
            stockHourlyResults.slice(0,24)
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



    const timePeriodStockChart = () => {

        let endPeriod

        switch (timePeriod) {
            case '1D': {
                endPeriod = 1
                break
            }
            case '1W': {
                endPeriod = 7
                break
            }
            case '1M': {
                endPeriod = 30
                break
            }
            case '3M': {
                endPeriod = 91
                break
            }
            case '6M': {
                endPeriod = 182
                break
            }
            case '1Y': {
                endPeriod = 365
                break                
            }
        }

        // console.log('stockTimePeriodResults is: ', stockTimePeriodResults)
        const abridgedTimePeriodStockData = 
            stockTimePeriodResults.slice(0, endPeriod)
            .map((timePeriodStat: any) => {
            return (
                {
                    date: timePeriodStat.date,
                    low: timePeriodStat.low,
                    high: timePeriodStat.high,
                    open: timePeriodStat.open,
                    close: timePeriodStat.close,
                    volume: timePeriodStat.volume
                }
            )
        })
        // console.log('abridgedTimePeriodStockData inside timePeriodStockChart() is: ', abridgedTimePeriodStockData)


        return (
            <ResponsiveContainer width="99%" height={400}>
                <AreaChart
                    data={abridgedTimePeriodStockData}
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
        // console.log('stockStash AFTER updating is: ', stockStash)
    }



    const tablesShownPostSearch = () => {
        // console.log(mostRecentSearch, stockResults, stockHourlyResults)
        if (stockResults.length > 0) {
            return (
                <div>
                    <br></br>
                    {<h2>My Stock Stash</h2>}
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
            axios.get(`https://financialmodelingprep.com/api/v3/quote/${mostRecentSearch}?apikey=4672ed38f1e727b95f8a9cbd22574eed`)
            .then(async (res) => {
                const stockData = await res.data
                // console.log('stockData[0]:', stockData[0]);
                setStockResults(stockData)      
            }).catch((error) => {
                console.error(error);
            });

            //Endpoint = Historical Price   (hour historicals)
            axios.get(`https://financialmodelingprep.com/api/v3/historical-chart/1hour/${mostRecentSearch}?apikey=4672ed38f1e727b95f8a9cbd22574eed`)
            .then(async (res) => {
                const stockHourlyData = await res.data
                // console.log('stockHourlyData:', stockHourlyData);
                setStockHourlyResults(stockHourlyData)      
            }).catch((error) => {
                console.error(error);
            });
            
            //Endpoint = Historical Price   (Days - historicals)
            axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${mostRecentSearch}?apikey=4672ed38f1e727b95f8a9cbd22574eed`)
            .then(async (res) => {
                const stockTimePeriodData = await res.data
                // console.log('stockTimePeriodData:', stockTimePeriodData);
                setStockTimePeriodResults(stockTimePeriodData.historical)      
            }).catch((error) => {
                console.error(error);
            });            

            //Company Description
            //To add next

            //Company or stock news articles
            //To add next


            setAllStocksTableVisability(false)
            displayAllStocksTable()

            setIsLoading(false)
            e.target.reset()
        } else {
            alert("Please check to see if you have entered a correct stock symbol, then try again.")
            setIsLoading(false)
            e.target.reset()
        }
        
    }
  


    if(error) {
        return <div>Error: {error}</div>
    }


    const handleTimePeriodChange = (e: any) => {
        setTimePeriod(e.target.value)
        // console.log('e is:', e)
        // console.log('changed time period clicked.')
    }



    const chartButtons = () => {
        const chartTimePeriods = [
            '1D',
            '1W',
            '1M',
            '3M',
            '6M',
            '1Y'
        ]

        
        const allButtons = chartTimePeriods.map((time) => {
            return (
            <Radio.Group key={time} value={timePeriod} onChange={e => handleTimePeriodChange(e)}>
                <Radio.Button value={time}>{time}</Radio.Button>
            </Radio.Group>
            )
        })

        return allButtons
    }



    const showSelectedPeriodChart = () => {
        if (timePeriod === '1D') {
            return hourlyStockChart()
        }
        return timePeriodStockChart()
    }


    const stockProfileColumns = () => {
        return (
            /* Antdesign grid columns */
            <div>
                <Divider orientation="left">Stock Profile</Divider>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={12}>
                    {/* <h1>{stockResults[0].symbol}</h1> */}
                    <div style={style}>{snapshotTable()}</div>
                    </Col>
                    <Col className="gutter-row" span={12}>
                    <div style={style}>
                        <ul className="nav" role="tablist">
                            {chartButtons()}
                        </ul>
                        {showSelectedPeriodChart()}
                        {/* {hourlyStockChart()}
                        {timePeriodStockChart()} */}
                    </div>
                    </Col>
                </Row>
            </div>
        )
    }


    const style: React.CSSProperties = { background: '#ffffff', padding: '8px 0' };

    return (
         <div className="App">
            <h1 className="StashTicker-header">StashTicker</h1>
            <BrowserRouter>
            {/* <Link to="/mystash">My Stash</Link> */}
              <Routes>
                <Route path="/" element={<Homepage />} />
                {/* <Route path="/" element={<SearchBar />} /> */}
                {/* <Route path="/search" element={<Stockdata />} /> */}
                <Route path="/mystash" element={<Mystash />} />
              </Routes>
            </BrowserRouter>               
            <br></br>
            <br></br>
            <SearchBar handleSubmit={handleSubmit} setMostRecentSearch={setMostRecentSearch} mostRecentSearch={mostRecentSearch} />
            <br></br>
            <button onClick={toggleAllStocksTable}>Toggle List of All Companies</button>
            <br></br>
            <br></br>
            {displayAllStocksTable()}
            {(stockResults.length || stockHourlyResults.length !== 0) ? stockProfileColumns() : null} 
            <br></br>
            {/* {(stockResults.length || stockHourlyResults.length !== 0) ? tablesShownPostSearch() : null}  */}
            <br></br>
            {/* <h2>All Companies</h2>
            {allStocksTable()} */}
            <br></br>         
        </div>
    )
}

export default App
