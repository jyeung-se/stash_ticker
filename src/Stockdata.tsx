import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/lib/table';

export default function StockData() {

    const [error, setError] = useState(null)
    const [stockResults, setStockResults] = useState<any>([])
    const [stockHourly, setStockHourly] = useState<any>([])

    
    useEffect(() => {

        //API key: 4672ed38f1e727b95f8a9cbd22574eed
        axios.get('https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=4672ed38f1e727b95f8a9cbd22574eed').then(async (res) => {
            const stockData = await res.data
            // console.log('stockData[0]:', stockData[0]);
            setStockResults(stockData)      
        }).catch((error) => {
            console.error(error);
        });

        axios.get('https://financialmodelingprep.com/api/v3/historical-chart/1hour/AAPL?apikey=4672ed38f1e727b95f8a9cbd22574eed').then(async (res) => {
            const stockHourlyData = await res.data
            console.log('stockHourlyData[0]:', stockHourlyData[0]);
            setStockResults(stockHourlyData)      
        }).catch((error) => {
            console.error(error);
        });
    }, [])



    let stockDisplayed = () => {
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

   
    let stockHourly = () => {
        console.log('stockHourly:', stockHourly[0]);
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




    interface DataType {
        key: React.Key;
        name: string;
        age: number;
        address: string;
      }


    const columns: ColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'name',
        filters: [
        {
            text: 'Joe',
            value: 'Joe',
        },
        {
            text: 'Jim',
            value: 'Jim',
        },
        {
            text: 'Submenu',
            value: 'Submenu',
            children: [
            {
                text: 'Green',
                value: 'Green',
            },
            {
                text: 'Black',
                value: 'Black',
            },
            ],
        },
        ],
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        onFilter: (value: string, record) => record.name.indexOf(value) === 0,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
    },
    {
        title: 'Age',
        dataIndex: 'age',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.age - b.age,
    },
    {
        title: 'Address',
        dataIndex: 'address',
        filters: [
        {
            text: 'London',
            value: 'London',
        },
        {
            text: 'New York',
            value: 'New York',
        },
        ],
        onFilter: (value: string, record) => record.address.indexOf(value) === 0,
    },
    ];


    let data = 


    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
    };
      
    const App: React.FC = () => <Table columns={columns} dataSource={data} onChange={onChange} />;





    if(error) {
        return <div>Error: {error}</div>
    }

    return (
       stockDisplayed()
        // <p>hi</p> 
    )
}




