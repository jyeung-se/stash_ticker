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


export default snapshotColumns