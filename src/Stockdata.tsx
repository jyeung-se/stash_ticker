import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

export default function StockData() {

    const [error, setError] = useState(null)
    const [stockResults, setStockResults] = useState<any>([])
    const [stockHourlyResults, setStockHourlyResults] = useState<any>([])
    const [searchQuery, setsearchQuery] = useState('')
 

    // API Calls
    // useEffect(() => {

    //     //API key: 4672ed38f1e727b95f8a9cbd22574eed
    //     axios.get('https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=4672ed38f1e727b95f8a9cbd22574eed').then(async (res) => {
    //         const stockData = await res.data
    //         // console.log('stockData[0]:', stockData[0]);
    //         setStockResults(stockData)      
    //     }).catch((error) => {
    //         console.error(error);
    //     });

    //     //continue here where you left off: correct variables for api call to hourly data to make graph/table for hourly prices
    //     axios.get('https://financialmodelingprep.com/api/v3/historical-chart/1hour/AAPL?apikey=4672ed38f1e727b95f8a9cbd22574eed').then(async (res) => {
    //         const stockHourlyData = await res.data
    //         console.log('stockHourlyData:', stockHourlyData);
    //         setStockHourlyResults(stockHourlyData)      
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // }, [])



    // displayed stock pre-table implementation
    // let stockOverviewDisplayed = () => {
    //     console.log('stockResults:', stockResults[0]);
    //     const {name, symbol, price, eps, dayHigh, dayLow, change} = stockResults[0] || {}
    //     // '|| {}' is for avoiding undefined due to data not available yet

    //     return (
    //         <div>
    //             <p>name: {name}</p>
    //             <p>symbol: {symbol}</p>
    //             <p>price: {price}</p>
    //             <p>eps: {eps}</p>
    //             <p>dayHigh: {dayHigh}</p>
    //             <p>dayLow: {dayLow}</p>
    //             <p>change: {change}</p>
    //         </div>
    //     )
    // }

   
    // stock hourly data displayed as text dump
    // let stockHourlyDisplayed: any = () => {
    //     console.log('stockHourlyDisplayed:', stockHourlyResults);

    //     return stockHourlyResults.map((hourData: any) => {
    //         return (
    //         <div>    
    //             <p>{hourData.close}</p>
    //             <p>{hourData.date}</p>
    //             <p>{hourData.high}</p>
    //             <p>{hourData.low}</p>
    //             <p>{hourData.volume}</p>
    //         </div>
    //         )
    //     })
    // }




    interface TableDataType {
        key: React.Key;
        name: string;
        age: number;
        address: string;
      }


    const overviewColumns: ColumnsType<TableDataType> = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>
    },
    {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol'
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


    const detailedColumns: ColumnsType<TableDataType> = [
        {
            title: 'Close',
            dataIndex: 'close',
            key: 'close'
            // render: text => <a>{text}</a>
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


      
    const stocksTable = () => <Table columns={overviewColumns} dataSource={stockResults} />;
    const detailedStockTable = () => <Table columns={detailedColumns} dataSource={stockHourlyResults} />; 


    // Search bar for stocks
    // Create functions for onChange 
    // value is the search string.
    const searchStocks = (stock: string) => {
        setsearchQuery(stock)
        // console.log("searchquery")
    }

    


    if(error) {
        return <div>Error: {error}</div>
    }

    return (
       <div>
            <div className="search-wrapper">
                <input
                    type="search"
                    placeholder="Search Stocks for..."
                    onChange={(e) => searchStocks(e.target.value)}
                />
            </div>
            <br></br>
            {stocksTable()}
            <br></br>
            {detailedStockTable()}
        </div>
    )
}




