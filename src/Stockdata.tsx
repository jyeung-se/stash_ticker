import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/lib/table';

export default function StockData() {

    const [error, setError] = useState(null)
    const [stockResults, setStockResults] = useState<any>([])
    const [stockHourlyResults, setStockHourlyResults] = useState<any>([])
 

    // API Calls
    useEffect(() => {

        //API key: 4672ed38f1e727b95f8a9cbd22574eed
        axios.get('https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=4672ed38f1e727b95f8a9cbd22574eed').then(async (res) => {
            const stockData = await res.data
            // console.log('stockData[0]:', stockData[0]);
            setStockResults(stockData)      
        }).catch((error) => {
            console.error(error);
        });

        //continue here where you left off: correct variables for api call to hourly data to make graph/table for hourly prices
        axios.get('https://financialmodelingprep.com/api/v3/historical-chart/1hour/AAPL?apikey=4672ed38f1e727b95f8a9cbd22574eed').then(async (res) => {
            const stockHourlyData = await res.data
            console.log('stockHourlyData:', stockHourlyData);
            setStockHourlyResults(stockHourlyData)      
        }).catch((error) => {
            console.error(error);
        });
    }, [])



    // displayed stock on load
    let stockOverviewDisplayed = () => {
        console.log('stockResults:', stockResults[0]);
        const {name, symbol, price, eps, dayHigh, dayLow, change} = stockResults[0] || {}
        // '|| {}' is for avoiding undefined due to data not available yet

        return (
            <div>
                <p>name: {name}</p>
                <p>symbol: {symbol}</p>
                <p>price: {price}</p>
                <p>eps: {eps}</p>
                <p>dayHigh: {dayHigh}</p>
                <p>dayLow: {dayLow}</p>
                <p>change: {change}</p>
            </div>
        )
    }

   
    // displayed stock
    let stockHourlyDisplayed: any = () => {
        console.log('stockHourlyDisplayed:', stockHourlyResults);

        return stockHourlyResults.map((hourData: any) => {
            return (
            <div>    
                <p>{hourData.close}</p>
                <p>{hourData.date}</p>
                <p>{hourData.high}</p>
                <p>{hourData.low}</p>
                <p>{hourData.volume}</p>
            </div>
            )
        })
    }




    // interface DataType {
    //     key: React.Key;
    //     name: string;
    //     age: number;
    //     address: string;
    //   }


    // const columns: ColumnsType<DataType> = [
    // {
    //     title: 'Name',
    //     dataIndex: 'name',
    //     filters: [
    //     {
    //         text: 'Joe',
    //         value: 'Joe',
    //     },
    //     {
    //         text: 'Jim',
    //         value: 'Jim',
    //     },
    //     {
    //         text: 'Submenu',
    //         value: 'Submenu',
    //         children: [
    //         {
    //             text: 'Green',
    //             value: 'Green',
    //         },
    //         {
    //             text: 'Black',
    //             value: 'Black',
    //         },
    //         ],
    //     },
    //     ],
    //     // specify the condition of filtering result
    //     // here is that finding the name started with `value`
    //     onFilter: (value: string, record) => record.name.indexOf(value) === 0,
    //     sorter: (a, b) => a.name.length - b.name.length,
    //     sortDirections: ['descend'],
    // },
    // {
    //     title: 'Age',
    //     dataIndex: 'age',
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.age - b.age,
    // },
    // {
    //     title: 'Address',
    //     dataIndex: 'address',
    //     filters: [
    //     {
    //         text: 'London',
    //         value: 'London',
    //     },
    //     {
    //         text: 'New York',
    //         value: 'New York',
    //     },
    //     ],
    //     onFilter: (value: string, record) => record.address.indexOf(value) === 0,
    // },
    // ];


    // let data = 


    // const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
    // };
      
    // const App: React.FC = () => <Table columns={columns} dataSource={data} onChange={onChange} />;





    if(error) {
        return <div>Error: {error}</div>
    }

    return (
       <div>
        {stockOverviewDisplayed()}
        {stockHourlyDisplayed()}
        </div>
        // <p>hi</p> 
    )
}




