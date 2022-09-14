import React, { useEffect, useState } from "react";
import moment from "moment";
import './App.css';
import { Table, Col, Divider, Row, Button, Radio, Space , Input, Card} from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Legend, Line } from 'recharts';
import SearchBar from './searchbar/SearchBar';
// import myStashColumns from '../datatypes/myStashColumns';
// import snapshotColumns from '../datatypes/snapshotColumns';
// import timePeriodColumns from '../datatypes/timePeriodColumns';
import allStocksColumns from '../datatypes/allStocksColumns';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';


const App = () => {

  const [error, setError] = useState(null)
  const [stockTickers, setStockTickers] = useState<any>([])
  const [allStocks, setAllStocks] = useState<any>([])
  const [stockResults, setStockResults] = useState<any>([])
  const [stockHourlyResults, setStockHourlyResults] = useState<any>([])
  const [mostRecentSearch, setMostRecentSearch] = useState('')
//   const [stockStash, setStockStash] = useState<any>([])
  const [allStocksTableVisability, setAllStocksTableVisability] = useState(true)
  const [timePeriod, setTimePeriod] = useState('1D')
  const [stockTimePeriodResults, setStockTimePeriodResults] = useState<any>([])
  const [companyProfile, setCompanyProfile] = useState<any>([])
//   const [filteredStockTickers, setFilteredStockTickers] = useState<any>([])
  const [isReadMore, setIsReadMore] = useState(true);
  const [stockPriceDollarChange, setStockPriceDollarChange] = useState(0)
  const [stockPricePercentChange, setStockPricePercentChange] = useState(0)
  const [lastSearch, setLastSearch] = useState('')
  const [inputValue, setInputValue] = useState('')

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([])
  const loading = open && options.length === 0
  


    const ReadMore = ({ children }: any) => {
        const text = children;
        const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
        };
        return (
        <h3 className="read-more">
            {isReadMore ? text.slice(0, 350) : text}
            <span onClick={toggleReadMore} className="read-or-hide">
            {isReadMore ? "...read more" : " show less"}
            </span>
        </h3>
        );
    };

    const toTitleCase = (str: string) => {
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
          }
        );
      }


    const numberFormat = (num: number) => {
        if(num < 1000){
            return num
        } else if (num < 1000000) {
            return (num/1000).toFixed(2) + 'K'
        } else if (num < 1000000000) {
            return (num/1000000).toFixed(2) + 'M'
        } else if (num < 1000000000000) {
            return (num/1000000000).toFixed(2) + 'B'
        } else if (num >= 1000000000000) {
            return (num/1000000000000).toFixed(2) + 'T'
        }
    }


    //Each API key has 250 free daily api calls, replace key with the other if hit cap for calls. 
    //API key#1: 4672ed38f1e727b95f8a9cbd22574eed -gmail
    //API key#2: 82c67b0e070a79fd0ab79b7b1987b6ba -yahoo
    //API key#3: f2fd9f5601de912d73c808de0f575e3f -skid
    //API key#4: 0fbc3128ecb93418721f51d266327cd4 -jaysolarlee
    //API key#4: 9d711c9bbba5f849bc33c4e46d3a775c -solarlee27


    useEffect(() => {   
        // API Calls for ALL stocks
        //Endpoint = Symbols List
        fetch('https://financialmodelingprep.com/api/v3/stock/list?apikey=82c67b0e070a79fd0ab79b7b1987b6ba').then(async (res) => {
            const stockData = await res.json()
            // console.log('stockData[0]:', stockData[0]);
            setAllStocks(stockData)
            const listOfStockTickers = stockData.map((ticker: any) => ticker.symbol)
            // console.log('list of stock tickers is: ', listOfStockTickers)
            setStockTickers(listOfStockTickers)
        }).catch((error) => {
            console.error(error);
        });
    }, [])
    

    useEffect(() => {
        const chartButtonDays =  
        [
            {period: '1W', days: 7},
            {period: '1M', days: 30},
            {period: '3M', days: 90},
            {period: '6M', days: 180},
            {period: '1Y', days: 365}
        ]
        
        let targetDays
        
        chartButtonDays.map((time) => {
            if (time.period === timePeriod) {
                targetDays = time.days
                // console.log('targetDays is: ', targetDays)
            }
        })

        if (mostRecentSearch !== '') {
            fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${lastSearch}?timeseries=${targetDays}&apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                setStockTimePeriodResults(data.historical.reverse())
            })
        }
    }, [lastSearch])


    useEffect(() => {
        setMostRecentSearch(inputValue)
        setLastSearch(inputValue)

        if (lastSearch !== '') {
            if (stockTickers.includes(inputValue)) {
                fetchStockInfo()
                .then(([stocks, stockHourly, companyProfile]) => {
                        setStockResults(stocks)
                        setStockHourlyResults(stockHourly)
                        setCompanyProfile(companyProfile)
                    }).catch((error) => {
                        console.error(error)
                    })
                    console.log(stockResults)
                setAllStocksTableVisability(false)
                displayAllStocksTable()
                setIsReadMore(true)
            }
        }
    }, [inputValue])
    
      
    // const snapshotTable = () => <Table className="flex-container" columns={snapshotColumns} dataSource={stockResults} />;
    // const myStashTable = () => <Table className="flex-container" columns={myStashColumns} dataSource={stockStash} />;
    // const hourlyStockTable = () => <Table className="flex-container" columns={timePeriodColumns} dataSource={stockHourlyResults} />; 
    // const timePeriodStockTable = () => <Table className="flex-container" columns={timePeriodColumns} dataSource={stockTimePeriodResults} />; 
    const allStocksTable = () => <Table className="flex-container" columns={allStocksColumns} dataSource={allStocks} />


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
            stockHourlyResults.slice(0,8).reverse()
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

        return (
            <div className="chart-wrapper">
                <ResponsiveContainer width="99%" height={400}>
                    <AreaChart
                        data={abridgedHourlyStockData}
                        margin={{
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <XAxis dataKey="date" />
                        <YAxis type="number" domain={['auto', 'auto']} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="close" name="Price" stroke="#1da842" fill="#1da842" />
                    </AreaChart> 
                </ResponsiveContainer>
            </div>
        )
    }


    const timePeriodStockChart = () => {
        return (
            <div className="chart-wrapper">
                <ResponsiveContainer width="99%" height={400}>     
                    <AreaChart
                        data={stockTimePeriodResults}
                        margin={{
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <XAxis dataKey="date" />
                        <YAxis type="number" domain={['auto', 'auto']} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="close" name="Price" stroke="#1da842" fill="#1da842" />
                    </AreaChart> 
                </ResponsiveContainer>                 
            </div>
        )
    }


    // const compareForSorting = (a: any, b: any) => {
    //     // console.log("compareForSorting fires off")
    //     if ( a.symbol < b.symbol ){
    //         return -1;
    //     }
    //     if ( a.symbol > b.symbol ){
    //         return 1;
    //     }
    //     return 0;
    // }


    // const addToStockStash = () => {
    //     // console.log('stockResults is: ', stockResults)
    //     // console.log('stockStash before updating is: ', stockStash)
    //     const listOfStockSymbolsInStash: any = () => {
    //         return stockStash.map((stock: any) => {
    //             return stock.symbol
    //         })
    //     }
    //     if (listOfStockSymbolsInStash().includes(stockResults[0].symbol)) {
    //         return alert('The stock has already been added to your Stash before. Please add a different stock instead.')
    //     }   
    //     setStockStash([...stockStash, ...stockResults].sort(compareForSorting))
    //     // console.log('stockStash AFTER updating is: ', stockStash)
    // }


    // const tablesShownPostSearch = () => {
    //     // console.log(mostRecentSearch, stockResults, stockHourlyResults)
    //     if (stockResults.length > 0) {
    //         return (
    //             <div>
    //                 <br></br>
    //                 {<h2>My Stock Stash</h2>}
    //                 {myStashTable()}
    //                 <br></br>
    //                 <h2>{stockResults[0].symbol} Profile</h2>
    //                 {snapshotTable()}
    //                 <button type="button" className="addToStockStashButton" onClick={addToStockStash}>Add to Stash</button>
    //                 <br></br>
    //                 <br></br>
    //                 {hourlyStockChart()}
    //                 <br></br>
    //                 <h2>{stockResults[0].symbol} Hourly Historicals</h2>
    //                 {hourlyStockTable()}
    //                 <br></br>
    //             </div>
    //         )
    //     }
    // }   


    // const toggleAllStocksTable = () => {
    //   setAllStocksTableVisability(!allStocksTableVisability)
    //   // console.log('stocktablevisibility state after toggle: ', AllStocksTableVisability)
    // }


    const displayAllStocksTable = () => {
        return allStocksTableVisability === true ? <div><br /><h2>All Companies</h2> <br></br> {allStocksTable()}</div> : null
    }


    const fetchStockInfo = async () => {
        const [stockData, stockHourlyData, companyProfileData] = await Promise.all([
            fetch(`https://financialmodelingprep.com/api/v3/quote/${mostRecentSearch}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`),
            fetch(`https://financialmodelingprep.com/api/v3/historical-chart/1hour/${mostRecentSearch}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`),
            fetch(`https://financialmodelingprep.com/api/v3/profile/${mostRecentSearch}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
        ])

        const stocks = await stockData.json()
        const stockHourly = await stockHourlyData.json()
        const companyProfile = await companyProfileData.json()

        return [stocks, stockHourly, companyProfile]
    }
    

    const handleTimePeriodChange = (e: any) => {
        setTimePeriod(e.target.value)
        // console.log('e.target.value is: ', e.target.value)

        // use the below for calculating business days between 2 dates. then interpolate into fetch url: targetDays.
        const moment = require('moment-business-days')
        let diff = moment('12-01-2021', 'MM-DD-YYYY').businessDiff(moment('12-31-2021','MM-DD-YYYY'))
        // console.log(diff)

        const chartButtonDays =  
            [
                {period: '1W', days: 7},
                {period: '1M', days: 30},
                {period: '3M', days: 90},
                {period: '6M', days: 180},
                {period: '1Y', days: 365}
            ]
            
        let targetDays
        
        chartButtonDays.map((time) => {
            if (time.period === e.target.value) {
                targetDays = time.days
                // console.log('targetDays is: ', targetDays)
            }
        })

        fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${lastSearch}?timeseries=${targetDays}&apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            // console.log('data is: ', data)
            setStockTimePeriodResults(data.historical.reverse())
            // console.log('stockTimePeriodResults is: ', stockTimePeriodResults)
            return data.historical
        })
        .then((reversedData) => {
            // console.log('reversedData is: ', reversedData)
            // console.log('data.reverse()[0].close is: ', reversedData[0].close)
            // console.log('stockResults[0].price is: ', stockResults[0].price)
            // console.log('stockResults[0].price - data.reverse()[0].close is: ', stockResults[0].price - reversedData[0].close)
            setStockPriceDollarChange(stockResults[0].price - reversedData[0].close)
            setStockPricePercentChange((stockResults[0].price - reversedData[0].close) / reversedData[0].close)
        })
        .catch((error: string) => {
            console.error(error)
        })
    }


  
    const setSearchStatesToText = (e: any) => {
        console.log(e.target.innerText)
        setMostRecentSearch(e.target.innerText)
        setLastSearch(e.target.innerText)
    }


    const handleSubmit = (e: any) => {
        e.preventDefault()
        setSearchStatesToText(e)
        setInputValue(e.target.innerText)

        
        if (stockTickers.includes(e.target.innerText)) {
            fetchStockInfo()
            .then(([stocks, stockHourly, companyProfile]) => {
                    setStockResults(stocks)
                    setStockHourlyResults(stockHourly)
                    setCompanyProfile(companyProfile)
                }).catch((error) => {
                    console.error(error)
                })
            setAllStocksTableVisability(false)
            displayAllStocksTable()
            setIsReadMore(true)
        } else if (e.target.innerText === '' || e.target.innerText === null) {
            return false
        } else {
            alert("Please check to see if you have entered a correct stock symbol, then try again.")
        }
    }


    const asyncSearchBar = () => {
        
        const onChangeHandle = (e: any) => {
            console.log('value is:', e.target.value)
            setMostRecentSearch(e.target.value.toUpperCase())
            // console.log(mostRecentSearch)

            setTimeout(async () => {
                await fetch(`https://financialmodelingprep.com/api/v3/search-ticker?query=${e.target.value.toUpperCase()}&limit=10&apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    console.log('data is: ', data)
                    setOptions(data)
                })
                // console.log("DelayED for 1.5 second.");
              }, 1500)
        }

        //save a reference to the TextField component, and use this ref to focus once another element is clicked (once some event was triggered).
        let inputRef

        return (
            <form onSubmit={(e) => handleSubmit(e)} className="async-search-field">
                <button type="submit" className="async-search-button">
                    <img src="search.png" className="async-search-button"/>
                </button>
                <Autocomplete
                    id="asynchronous-demo"
                    style={{ width: 300 }}
                    open={open}
                    onOpen={() => {
                        setOpen(true)
                    }}
                    onClose={() => {
                        setOpen(false)
                    }}
                    onChange={(e) => {
                        handleSubmit(e)
                    }}
                    isOptionEqualToValue={(option: any, value: any) => option.symbol === value.symbol}
                    getOptionLabel={option => option.symbol}
                    options={mostRecentSearch !== "" ? options : [{symbol: '-'}]}
                    loading={loading}
                    disableClearable
                    renderInput={params => (
                        <TextField
                        {...params}
                        label="Search Stock Symbol"
                        variant="standard"
                        onChange={e => {
                            // dont fire API if the input is blank or empty
                            if (e.target.value !== '') {
                                onChangeHandle(e)
                            }
                        }}
                        inputRef={input => {
                            inputRef = input
                            // console.log('inputRef is: ', inputRef)
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                            <React.Fragment>
                                {mostRecentSearch !== "" ? (loading ? <CircularProgress color="inherit" size={20} /> : null) : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                            )
                        }}
                        />
                    )}
                />
            </form>
        )


    }



    if(error) {
        return <div>Error: {error}</div>
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

        // include 'wrap' as a prop after size prop in <Space> if you want the buttons to wrap upon shrinking window size.
        return <Space size={[10, 10]}>{allButtons}</Space>
    }


    const showSelectedPeriodChart = () => {
        if (timePeriod === '1D') {
            return hourlyStockChart()
        }
        return timePeriodStockChart()
    }


    const chartHeaderPriceStats = () => {
        if (timePeriod === '1D') {
            return stockResults[0].changesPercentage > 0 ? <h2 className="stock-change-up">$&nbsp;{stockResults[0].change.toFixed(2)} ({stockResults[0].changesPercentage.toFixed(2)}%) Today</h2> : <h2 className="stock-change-down">$&nbsp;{stockResults[0].change.toFixed(2)} ({stockResults[0].changesPercentage.toFixed(2)}%) Today</h2>
        } else {
            return stockPriceDollarChange > 0 ? <h2 className="stock-change-up">$&nbsp;{stockPriceDollarChange.toFixed(2)} ({(stockPricePercentChange * 100).toFixed(2)}%) Today</h2> : <h2 className="stock-change-down">$&nbsp;{stockPriceDollarChange.toFixed(2)} ({(stockPricePercentChange * 100).toFixed(2)}%) Today</h2> 
        }
    }


    const stockQuickStats = () => {
        return (
            <div>
                <div className="stock-header">
                    <Divider orientation="left"></Divider>
                    {<h1 className="stock-name">{stockResults[0].name} ({stockResults[0].symbol})</h1>} 
                    <br />
                    <h1 className="stock-price">${stockResults[0].price}</h1> 
                    <br />
                    {chartHeaderPriceStats()}
                </div>
                {showSelectedPeriodChart()}
                <br />
                <ul className="chart-buttons">
                    {chartButtons()}
                </ul>
                <br />
                <br />
                <Row>
                <Col span={10} offset={7}>
                    <Divider orientation="left">Key Statistics</Divider>
                </Col>
                    <Col span={3} offset={7}>
                        <h3 className="h3-left">Market Cap</h3>
                        <h3 className="h3-about-data">{numberFormat(stockResults[0].marketCap)}</h3>
                        <h3 className="h3-left">High today</h3>
                        <h3 className="h3-about-data">${stockResults[0].dayHigh.toFixed(2)}</h3>
                        <h3 className="h3-left">52 Week high</h3>
                        <h3 className="h3-about-data">${stockResults[0].yearHigh.toFixed(2)}</h3>
                    </Col>
                    <Col span={3}>
                        <h3 className="h3-left">Price-Earnings ratio</h3>
                        <h3 className="h3-about-data">{stockResults[0].pe === null ? 0 : stockResults[0].pe.toFixed(2)}</h3>
                        <h3 className="h3-left">Low today</h3>
                        <h3 className="h3-about-data">${stockResults[0].dayLow.toFixed(2)}</h3>
                        <h3 className="h3-left">52 Week low</h3>
                        <h3 className="h3-about-data">${stockResults[0].yearLow.toFixed(2)}</h3>
                    </Col>
                    <Col span={3}>
                        <h3 className="h3-left">Dividend yield</h3>
                        <h3 className="h3-about-data">{companyProfile[0].lastDiv === 0 ? '-' : companyProfile[0].lastDiv.toFixed(2)}</h3>
                        <h3 className="h3-left">Open price</h3>
                        <h3 className="h3-about-data">${stockResults[0].open.toFixed(2)}</h3>
                    </Col>
                    <Col span={3}>
                        <h3 className="h3-left">Average volume</h3>
                        <h3 className="h3-about-data">{numberFormat(stockResults[0].avgVolume)}</h3>
                        <h3 className="h3-left">Volume</h3>
                        <h3 className="h3-about-data">{numberFormat(stockResults[0].volume)}</h3>
                    </Col>
                </Row>
                <br />
                <br />
                <Row>
                    <Col span={10} offset={7}>
                    <Divider orientation="left">About</Divider>
                        <h3 className="h3-about">
                        <ReadMore>
                            {companyProfile[0].description}
                        </ReadMore>
                        </h3>  
                    </Col>
                </Row>
                <br />
                <br />
                <Row>
                    <Col span={3} offset={7}>
                        <h3 className="h3-left">CEO</h3>
                        <h3 className="h3-about-data">{companyProfile[0].ceo}</h3>
                    </Col>
                    <Col span={3}>
                        <h3 className="h3-left">Employees</h3>
                        <h3 className="h3-about-data">{companyProfile[0].fullTimeEmployees}</h3>
                    </Col>
                    <Col span={3}>
                        <h3 className="h3-left">Headquarters</h3>
                        <h3 className="h3-about-data">{companyProfile[0].city},<br></br> {toTitleCase(companyProfile[0].state)}</h3>
                    </Col>
                    <Col span={3}>
                        <h3 className="h3-left">IPO Date</h3>
                        <h3 className="h3-about-data">{companyProfile[0].ipoDate}</h3>
                    </Col>
                </Row>
                <br />
                <br />
                <br />
                <br />
            </div>
        )
    }


    return (
         <div className="App">
            <br />
            {asyncSearchBar()}
            {/* <SearchBar handleSubmit={handleSubmit} setMostRecentSearch={setMostRecentSearch} mostRecentSearch={mostRecentSearch} /> */}
            {displayAllStocksTable()}
            {(stockResults.length > 0 && stockHourlyResults.length > 0) ? stockQuickStats() : null}
        </div>
    )
}

export default App