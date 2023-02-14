import Table from "antd/es/table"
import allStocksColumns from "../datatypes/allStocksColumns"


const AllStocksTable = ({allStocks}: {allStocks: any}) => {
    return (
        <Table className="flex-container" columns={allStocksColumns} dataSource={allStocks} />
    )
}

export default AllStocksTable