import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import './App.css';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StockData() {

    const [error, setError] = useState(null)
    const [stockTickers, setStockTickers] = useState<any>([])
    const [allStocks, setAllStocks] = useState<any>([])
    const [stockResults, setStockResults] = useState<any>([])
    const [stockHourlyResults, setStockHourlyResults] = useState<any>([])
    const [searchQuery, setsearchQuery] = useState('')
    const [mostRecentSearch, setMostRecentSearch] = useState('')



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


      
    const snapshotTable = () => <Table columns={snapshotColumns} dataSource={stockResults} />;
    const allStocksTable = () => <Table columns={allStocksColumns} dataSource={allStocks} />;
    const hourlyStockTable = () => <Table columns={hourlyColumns} dataSource={stockHourlyResults} />; 


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
            <AreaChart
                width={1000}
                height={400}
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
                <Area type="monotone" dataKey="low" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="high" stroke="#FACC32" fill="#FACC32" />
            </AreaChart>    
        )
    }

    const tablesShownPostSearch = () => {
        // console.log(stockResults, stockHourlyResults)
        if (mostRecentSearch !== '' && stockResults.length > 0) {
            return (
                <div>
                    <h2>{stockResults[0].symbol} Profile</h2>
                    {snapshotTable()}
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


    const handleSubmit = (e: any) => {
        e.preventDefault()
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
        <div>
            <div className="search-wrapper">
                <form onSubmit={handleSubmit}>
                    <input type="text" onChange={(e) => {
                        setsearchQuery(e.target.value.toUpperCase())
                        setMostRecentSearch(e.target.value.toUpperCase())}} 
                        placeholder="Stock Symbol"/>
                    <input type="submit" value="Search" />
                </form>                
            </div>
            <br></br>
            {(stockResults.length || stockHourlyResults.length !== 0) ? tablesShownPostSearch() : null} 
            <h2>All Companies</h2>
            {allStocksTable()}
            <br></br>
        </div>
    )
}




