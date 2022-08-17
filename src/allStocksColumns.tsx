import type { ColumnsType } from 'antd/es/table';



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


    export default allStocksColumns