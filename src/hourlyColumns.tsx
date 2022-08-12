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

    export default hourlyColumns