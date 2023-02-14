import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const HourlyStockChart = ({abridgedHourlyStockData}: {abridgedHourlyStockData: any}) => {
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
                    <Area type="monotone" dataKey="close" name="Price" stroke="#1da842" fill="#1da842" />
                </AreaChart> 
            </ResponsiveContainer>
        </div>
    )
}

export default HourlyStockChart