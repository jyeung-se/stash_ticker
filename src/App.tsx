import React, { useEffect, useState } from "react";
import moment from "moment";
import './App.css';
import Typeahead from 'react-bootstrap-typeahead';
import background from './BlueVectorBackground.jpg';
import Homepage from './Homepage'
import Mystash from './Mystash'
import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import { Table, Col, Divider, Row, Button, Radio, Space , Input, Card} from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SearchBar from './SearchBar'
import myStashColumns from './myStashColumns';
import snapshotColumns from './snapshotColumns';
import allStocksColumns from './allStocksColumns';
import timePeriodColumns from './timePeriodColumns';
// import staticData from "./staticData";



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
  const [companyProfile, setCompanyProfile] = useState<any>([])
  const [filteredStockTickers, setFilteredStockTickers] = useState<any>([])
  const [isReadMore, setIsReadMore] = useState(true);
  const [dateFrom ,setDateFrom] = useState('')


  
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
            return (num/1000000).toFixed(2) + 'K'
        } else if (num < 1000000000) {
            return (num/1000000000).toFixed(2) + 'M'
        } else if (num < 1000000000000) {
            return (num/1000000000000).toFixed(2) + 'B'
        } else if (num >= 1000000000000) {
            return (num/1000000000000).toFixed(2) + 'T'
        }
    }

    // // API Calls for ALL stocks
    useEffect(() => {
      //Each API key has 250 free daily api calls, replace key with the other if hit cap for calls. 
      //API key#1: 4672ed38f1e727b95f8a9cbd22574eed -gmail
      //API key#2: 82c67b0e070a79fd0ab79b7b1987b6ba -yahoo
      //API key#3: f2fd9f5601de912d73c808de0f575e3f -skid


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
       
        const dateTo = moment(new Date())

        switch (timePeriod) {
            // case '1D': {
            //     const startDate = dateTo.clone().subtract(1, 'day').format('YYYY-MM-DD')
            //     setDateFrom(startDate)
            //     break
            // }
            case '1W': {
                const startDate = dateTo.clone().subtract(1, 'week').format('YYYY-MM-DD')
                fetchTimePeriodStats(startDate, dateTo)
                break
            }
            case '1M': {
                const startDate = dateTo.clone().subtract(1, 'month').format('YYYY-MM-DD')
                fetchTimePeriodStats(startDate, dateTo)
                break
            }
            case '3M': {
                const startDate = dateTo.clone().subtract(3, 'month').format('YYYY-MM-DD')
                fetchTimePeriodStats(startDate, dateTo)
                break
            }
            case '6M': {
                const startDate = dateTo.clone().subtract(6, 'month').format('YYYY-MM-DD')
                fetchTimePeriodStats(startDate, dateTo)
                break
            }
            case '1Y': {
                const startDate = dateTo.clone().subtract(1, 'year').format('YYYY-MM-DD')
                fetchTimePeriodStats(startDate, dateTo)
                break
            }
        }
    }, [timePeriod])


      
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
            stockHourlyResults.slice(0,24).reverse()
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
                        <Area type="monotone" dataKey="high" stroke="#7d4ebf" fill="#7d4ebf" />
                        <Area type="monotone" dataKey="low" stroke="#9aeb67" fill="#9aeb67" />
                    </AreaChart> 
                </ResponsiveContainer>
            </div>
        )
    }

    {
        // var endDate = moment(new Date())
        // var startDate = endDate.clone().subtract(1, 'week')
        // console.log(startDate.format('YYYY-MM-DD'))
        // console.log(typeof startDate.format('YYYY-MM-DD'))
        // console.log(endDate.format('YYYY-MM-DD'))
        // const startDate = moment(new Date()).subtract(1, 'week').format('YYYY-MM-DD')
        // console.log('startDate is: ', startDate)
    }



    const timePeriodStockChart = () => {

        // console.log('stockTimePeriodResults right before rendering is: ', stockTimePeriodResults)
        
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
                        <Area type="monotone" dataKey="high" stroke="#7d4ebf" fill="#7d4ebf" />
                        <Area type="monotone" dataKey="low" stroke="#9aeb67" fill="#9aeb67" />
                    </AreaChart> 
                </ResponsiveContainer>                 
            </div>
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


    const handleSubmit = (e: any) => {
        e.preventDefault()
        setMostRecentSearch(mostRecentSearch)

        if (stockTickers.includes(mostRecentSearch)) {
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

            setIsLoading(false)
        } else {
            alert("Please check to see if you have entered a correct stock symbol, then try again.")
            setIsLoading(false)
        }
    }



    if(error) {
        return <div>Error: {error}</div>
    }



    const fetchTimePeriodStats = (startDate: string, dateTo: any) => {

        fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${mostRecentSearch}?from=${startDate}&to=${dateTo.format('YYYY-MM-DD')}&apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log('data is: ', data)
            setStockTimePeriodResults(data.historical.reverse())
            // console.log('stockTimePeriodResults is: ', stockTimePeriodResults)
            return stockTimePeriodResults
        }).catch((error) => {
            console.error(error)
        })
    }


    const handleTimePeriodChange = (e: any) => {
        setTimePeriod(e.target.value)
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


    const stockQuickStats = () => {
        return (
            /* Antdesign grid columns */
            <div>
                <div className="stock-header">
                    <Divider orientation="left"></Divider>
                    {(stockResults.length || stockHourlyResults.length !== 0) ? <h1 className="stock-name">{stockResults[0].name} ({stockResults[0].symbol})</h1> : null} 
                    <br />
                    <h1 className="stock-price">${stockResults[0].price}</h1> 
                    <br />
                    {stockResults[0].changesPercentage > 0 ? <h2 className="stock-change-up">$&nbsp;{(Math.round((stockResults[0].change + Number.EPSILON).toFixed * 100) / 100).toFixed(2)} ({Math.round((stockResults[0].changesPercentage + Number.EPSILON) * 100) / 100}%) Today</h2> : <h2 className="stock-change-down">${(Math.round((stockResults[0].change + Number.EPSILON) * 100) / 100).toFixed(2)} ({Math.round((stockResults[0].changesPercentage + Number.EPSILON) * 100) / 100}%) Today</h2>}
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
                        <h3 className="h3-about-data">{stockResults[0].pe.toFixed(2)}</h3>
                        <h3 className="h3-left">Low today</h3>
                        <h3 className="h3-about-data">${stockResults[0].dayLow.toFixed(2)}</h3>
                        <h3 className="h3-left">52 Week low</h3>
                        <h3 className="h3-about-data">${stockResults[0].yearLow.toFixed(2)}</h3>

                    </Col>
                    <Col span={3}>
                        <h3 className="h3-left">Dividend yield</h3>
                        <h3 className="h3-about-data">{companyProfile[0] && companyProfile[0].lastDiv === 0 ? '-' : companyProfile[0].lastDiv.toFixed(2)}</h3>
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
                <br />
                <br />

            </div>
        )
    }
        


    const myStashLeftModule = () => {   
        return (
            <Col className="gutter-row" span={6}>
                stock1
            </Col>
        )
    }
    

    const showMainStockInfo = () => {
        return (
            <Col span={24}>
                {displayAllStocksTable()}
                {(stockResults.length || stockHourlyResults.length !== 0) ? stockQuickStats() : null} 
            </Col>
        )
    }



    const style: React.CSSProperties = { background: '#ffffff', padding: '8px 0' };

    return (
         <div className="App">

            <br />
            <SearchBar handleSubmit={handleSubmit} setMostRecentSearch={setMostRecentSearch} mostRecentSearch={mostRecentSearch} />


            {/* <button onClick={toggleAllStocksTable}>Toggle List of All Companies</button> */}
            {/* {allStocksTableVisability === false && stockResults.length === 0 || (allStocksTableVisability === false) && stockResults.length > 0 ? <Row>{showMainStockInfo()}</Row> : displayAllStocksTable()} */}
            {/* {showMainStockInfo()} */}
            {displayAllStocksTable()}
            {(stockResults.length || stockHourlyResults.length !== 0) ? stockQuickStats() : null}
            {/* {stockResults && stockResults.length > 0 ? <Row>{showMainStockInfo()}</Row> : displayAllStocksTable()} */}
        </div>
    )
}

export default App
