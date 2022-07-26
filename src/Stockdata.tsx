import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

export default function StockData() {

    const [error, setError] = useState(null)
    const [allStocks, setAllStocks] = useState<any>([])
    const [stockResults, setStockResults] = useState<any>([])
    const [stockHourlyResults, setStockHourlyResults] = useState<any>([])
    const [searchQuery, setsearchQuery] = useState('')



    // // API Calls for ALL stocks (NOT COMPLETED YET - RESUME LATER)
    useEffect(() => {
        //Each API key has 250 free daily api calls
        //API key#1: 4672ed38f1e727b95f8a9cbd22574eed -gmail
        //API key#2: 82c67b0e070a79fd0ab79b7b1987b6ba -yahoo
        //Endpoint = Symbols List
        axios.get('https://financialmodelingprep.com/api/v3/stock/list?apikey=82c67b0e070a79fd0ab79b7b1987b6ba').then(async (res) => {
            const stockData = await res.data
            // console.log('stockData[0]:', stockData[0]);
            setAllStocks(stockData)      
        }).catch((error) => {
            console.error(error);
        });

    //     //continue here where you left off: correct variables for api call to hourly data to make graph/table for hourly prices
    //     axios.get('https://financialmodelingprep.com/api/v3/historical-chart/1hour/AAPL?apikey=82c67b0e070a79fd0ab79b7b1987b6ba').then(async (res) => {
    //         const stockHourlyData = await res.data
    //         console.log('stockHourlyData:', stockHourlyData);
    //         setStockHourlyResults(stockHourlyData)      
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    }, [])



    // useEffect(() => {
    //     //API key: 4672ed38f1e727b95f8a9cbd22574eed

    //     // API Call onChange of searchbar input 
    //     axios.get(`https://financialmodelingprep.com/api/v3/search?query=${searchQuery}&limit=10&exchange=NASDAQ&apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
    //     .then(async (res) => {    
    //         const stockData = await res.data
    //             // console.log('queried stockData:', stockData);
    //             setStockResults(stockData)      
    //         }).catch((error) => {
    //             console.error(error);
    //     });

        // // API Call for SPECIFICALLY ONLY 1 STOCK = APPLE 
        // axios.get('https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=82c67b0e070a79fd0ab79b7b1987b6ba')
        // .then(async (res) => {
        //     const stockData = await res.data
        //     // console.log('stockData[0]:', stockData[0]);
        //     setStockResults(stockData)      
        // }).catch((error) => {
        //     console.error(error);
        // });
        // }, [])

    //     // API Call for hourly data of specific stock
    //     axios.get(`https://financialmodelingprep.com/api/v3/historical-chart/1hour/${searchQuery}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
    //     .then(async (res) => {
    //         const stockHourlyData = await res.data
    //         // console.log('stockHourlyData:', stockHourlyData);
    //         setStockHourlyResults(stockHourlyData)      
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // }, [searchQuery])


    // useEffect(() => {
    //     axios.get(`https://financialmodelingprep.com/api/v3/search?query=${searchQuery}&limit=10&exchange=NASDAQ&apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
    //     .then(async (res) => {    
    //         const stockData = await res.data
    //             // console.log('queried stockData:', stockData);
    //             setStockResults(stockData)      
    //         }).catch((error) => {
    //             console.error(error);
    //     })
    // }, [searchQuery])





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
        key: 'symbol',
        render: text => <a>{text}</a>
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
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
        key: 'symbol',
        render: text => <a>{text}</a>
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
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


    // Search bar for stocks
    // Create functions for onChange 
    // value is the search string.
    const searchStocks = (stock: string) => {
        setsearchQuery(stock)
        // console.log("searchquery")
    }

    const handleSubmit = (e: any) => {
        if (searchQuery !== '') {
            //Endpoint = Company Quote
            axios.get(`https://financialmodelingprep.com/api/v3/quote/${searchQuery.toUpperCase()}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
            .then(async (res) => {
                const stockData = await res.data
                // console.log('stockData[0]:', stockData[0]);
                setStockResults(stockData)      
            }).catch((error) => {
                console.error(error);
            });

            //Endpoint = Historical Price   (hour historicals)
            axios.get(`https://financialmodelingprep.com/api/v3/historical-chart/1hour/${searchQuery.toUpperCase()}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
            .then(async (res) => {
                const stockHourlyData = await res.data
                // console.log('stockHourlyData:', stockHourlyData);
                setStockHourlyResults(stockHourlyData)      
            }).catch((error) => {
                console.error(error);
            });

            e.preventDefault()
        }
    }


    if(error) {
        return <div>Error: {error}</div>
    }

    return (
       <div>
            <div className="search-wrapper">
                <form onSubmit={handleSubmit}>
                    <input type="text" onChange={(e) => setsearchQuery(e.target.value)} placeholder="Stock Name / Ticker"/>
                    <input type="submit" value="Search" />
                </form>                
                {/* <input
                    type="search"
                    placeholder="Search Stocks for..."
                    onChange={(e) => setsearchQuery(e.target.value)}
                    onSubmit={e.preventDefault}
                /> */}
            </div>
            <br></br>
            <h2>Stock Snapshot</h2>
            {snapshotTable()}
            <br></br>
            <h2>Hourly Stock Historicals</h2>
            {hourlyStockTable()}
            <br></br>
            <h2>All Companies</h2>
            {allStocksTable()}
            <br></br>
        </div>
    )
}




