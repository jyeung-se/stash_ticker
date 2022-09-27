import React, { useEffect, useState } from "react";
import moment from "moment";
import './App.css';
import { Table, Col, Divider, Row, Button, Radio, Space , Input, Card} from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SearchBar from '../components/searchbar/SearchBar';
// import myStashColumns from '../datatypes/myStashColumns';
// import snapshotColumns from '../datatypes/snapshotColumns';
// import timePeriodColumns from '../datatypes/timePeriodColumns';
import allStocksColumns from '../datatypes/allStocksColumns';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingSpinner from "../components/LoadingSpinner";

import AsyncSearchBar from "../components/searchbar/AsyncSearchBar";
import ReadMore from "../components/ReadMore";
import dayOrNight from "../utils/dayOrNight";
import toTitleCase from "../utils/toTitleCase";
import numberFormat from "../utils/numberFormat";
import HourlyStockChart from "../components/HourlyStockChart";
import TimePeriodStockChart from "../components/TimePeriodStockChart";
import AllStocksTable from "../components/AllStocksTable";
import store, { AppDispatch } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { getAllStocks } from "../components/allStocksSlice";
import { getSelectedStock, getSelectedStockTimePeriod, setSearchLoading, setTargetDays, setStockPriceDollarChange, setStockPricePercentChange } from "../components/selectedStockSlice";
import { setTypeaheadOpen, setSearchValue, setSubmittedSearchValue, getSearchOptions } from "../components/searchSlice";


const App = () => {

    const [error, setError] = useState(null)
    // const [timePeriod, setTimePeriod] = useState('1D')
    const [isReadMore, setIsReadMore] = useState(true);
    const [stockPriceDollarChange, setStockPriceDollarChange] = useState(0)
    const [stockPricePercentChange, setStockPricePercentChange] = useState(0)

    const dispatch = useDispatch<AppDispatch>()
    const search = useSelector((state: any) => state.search)
    const selectedStock = useSelector((state: any) => state.selectedStock)
    const {initialHomePageStocks, appLoading} = useSelector((state: any) => state.totalStocks)

    const open = useSelector((state: any) => state.search.searchOpen)
    const options = useSelector((state: any) => state.search.searchOptions)
    const searchLoading = useSelector((state: any) => state.selectedStock.searchLoading)
    const targetDays = useSelector((state: any) => state.selectedStock.targetDays)
    const selectedStockTimePeriodStats = useSelector((state: any) => state.selectedStock.selectedStockTimePeriodStats) 


    const loading = useSelector((state: any) => state.search.typeahead && state.search.searchOptions.length === 0)



    //Each API key has 250 free daily api calls, replace key with the other if hit cap for calls. 
    //API key#1: 4672ed38f1e727b95f8a9cbd22574eed -gmail
    //API key#2: 82c67b0e070a79fd0ab79b7b1987b6ba -yahoo
    //API key#3: f2fd9f5601de912d73c808de0f575e3f -skid
    //API key#4: 0fbc3128ecb93418721f51d266327cd4 -jaysolarlee
    //API key#4: 9d711c9bbba5f849bc33c4e46d3a775c -solarlee27
    //API key#4: 04ca01ddef8b21144591ac6ddca362d4 -jsolarislee


    useEffect(() => {   
        dispatch(getAllStocks())
        // console.log(initialHomePageStocks)
    }, [])


    const abridgedHourlyStockData = 
    selectedStock.selectedStockHourlyStats.slice(0,8).reverse()
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


    const displayAllStocksTable = () => {
        // return allStocksTableVisability === true ? <div><br /><h2>All Companies</h2> <br></br> {allStocksTable()}</div> : null
        if (search.submittedSearchValue === '') {
            return <div><br /><h2>All Companies</h2> <br></br> <AllStocksTable allStocks={initialHomePageStocks} /></div>
        }
    }


    const handleTimePeriodChange = (e: any) => {
        // console.log('e.target.value is: ', e.target.value)

        // use the below for calculating business days between 2 dates. then interpolate into fetch url: targetDays.
        const moment = require('moment-business-days')
        let diff = moment('12-01-2021', 'MM-DD-YYYY').businessDiff(moment('12-31-2021','MM-DD-YYYY'))
        // console.log(diff)

        dispatch(setTargetDays(e.target.value))
        dispatch(getSelectedStockTimePeriod())
    }


    const handleSubmitForm = (e: any) => {
        e.preventDefault()

        if (searchLoading === false) {
            dispatch(setSearchLoading())
            setTimeout(() => {
                dispatch(setSubmittedSearchValue(search.searchValue))
                dispatch(getSelectedStock())
                setIsReadMore(true)         
            }, 100)

            setTimeout(() => {
                dispatch(setSearchLoading())
            }, 2000)
        } else if (search.searchValue === '' || search.searchValue === null) {
            return false
        } else {
            alert("Please check to see if you have entered a correct stock symbol, then try again.")
        }
    }


    const handleSubmitAutocomplete = (e: any, value: any) => {
        e.preventDefault()

        if (searchLoading === false) {
            dispatch(setSearchLoading())
            setTimeout(() => {
                dispatch(setSubmittedSearchValue(value.symbol))
                dispatch(getSelectedStock())
                setIsReadMore(true)         
            }, 100)

            setTimeout(() => {
                dispatch(setSearchLoading())
            }, 2000)
        } else if (value.symbol === '' || value.symbol === null) {
            return false
        } else {
            alert("Please check to see if you have entered a correct stock symbol, then try again.")
        }
    }


    const handleSearchOnChange = (e: any, value: any) => {
        console.log('e: ', e)
        console.log('value: ', value)
        dispatch(setSearchValue(value.symbol.toUpperCase()))
        dispatch(setSubmittedSearchValue(value.symbol.toUpperCase()))
        handleSubmitAutocomplete(e, value)
    }


    const asyncSearchBar = () => {
        
        //save a reference to the TextField component, and use this ref to focus once another element is clicked (once some event was triggered).
        let inputRef

        return (
            <form onSubmit={(e) => handleSubmitForm(e)} className="async-search-field">
                <button type="submit" className="async-search-button">
                    <img src="search.png" className="async-search-button"/>
                </button>
                <Autocomplete
                    id="asynchronous-demo"
                    style={{ width: 300 }}
                    open={open}
                    onOpen={() => {
                        dispatch(setTypeaheadOpen())
                    }}
                    onClose={() => {
                        dispatch(setTypeaheadOpen())
                    }}
                    onChange={(e, value) => handleSearchOnChange(e, value)}
                    isOptionEqualToValue={(option: any, value: any) => option.symbol === value.symbol}
                    getOptionLabel={option => option.symbol}
                    options={Array.isArray(options) && options.length > 0 ? options : [{symbol: '-'}]}
                    loading={loading}
                    disableClearable
                    renderInput={params => (
                        <TextField
                        {...params}
                        label="Search Stock Symbol"
                        variant="standard"
                        onChange={e => {
                            // dont fire API if the input is blank or empty
                            console.log(e.target.value)
                            if (e.target.value !== '' || e.target.value !== null) {
                                dispatch(setSearchValue(e.target.value.toUpperCase()))
                                setTimeout(() => {
                                    dispatch(getSearchOptions())
                                }, 1500)
                            }
                        }}
                        inputRef={input => {
                            inputRef = input
                            // console.log('inputRef is: ', inputRef)
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                            <React.Fragment>
                                {search.searchValue !== "" ? (loading ? <CircularProgress color="inherit" size={20} /> : null) : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                            )
                        }}
                        />
                    )}
                />
            </form>
        )
    }


    if(error) {
        return <div>Error: {error}</div>
    }


    const chartButtons = () => {
        const chartTimePeriods = [
            '1D',
            '1W',
            '1M',
            '3M',
            '6M',
            '1Y'
        ]
        
        const allButtons = chartTimePeriods.map((time) => {
            return (
                <Radio.Group key={time} value={selectedStock.targetDays} onChange={e => handleTimePeriodChange(e)}>
                    <Radio.Button value={time}>{time}</Radio.Button>
                </Radio.Group>
            )
        })

        // include 'wrap' as a prop after size prop in <Space> if you want the buttons to wrap upon shrinking window size.
        return <Space size={[10, 10]}>{allButtons}</Space>
    }


    const showSelectedPeriodChart = () => {
        if (targetDays === '1D') {
            return <HourlyStockChart abridgedHourlyStockData={abridgedHourlyStockData} /> 
        } else {
            // dispatch(setStockPriceDollarChange(selectedStock.selectedStockStats[0].price - selectedStock.selectedStockTimePeriodStats[-1].close))
            // dispatch(setStockPriceDollarChange((selectedStock.selectedStockStats[0].price - selectedStock.selectedStockTimePeriodStats[-1].close) / selectedStock.selectedStockTimePeriodStats[-1].close))
            
            // CONTINUE OFF HERE: CORRECTLY UPDATE DOLLAR AND PERCENT CHANGE ON BUTTON CLICKS FOR DIFFERENT TIME PERIODS
        
            console.log(selectedStock)
            // dispatch(setStockPriceDollarChange())
            // dispatch(setStockPricePercentChange())
            return <TimePeriodStockChart stockTimePeriodResults={selectedStockTimePeriodStats} />
        }
    }


    const chartHeaderPriceStats = () => {
        if (targetDays === '1D') {
            return selectedStock.selectedStockStats[0].changesPercentage > 0 ? <h2 className="stock-change-up">$&nbsp;{selectedStock.selectedStockStats[0].change.toFixed(2)} ({selectedStock.selectedStockStats[0].changesPercentage.toFixed(2)}%) Today</h2> : <h2 className="stock-change-down">$&nbsp;{selectedStock.selectedStockStats[0].change.toFixed(2)} ({selectedStock.selectedStockStats[0].changesPercentage.toFixed(2)}%) Today</h2>
        } else {
            return stockPriceDollarChange > 0 ? <h2 className="stock-change-up">$&nbsp;{stockPriceDollarChange.toFixed(2)} ({(stockPricePercentChange * 100).toFixed(2)}%) Today</h2> : <h2 className="stock-change-down">$&nbsp;{stockPriceDollarChange.toFixed(2)} ({(stockPricePercentChange * 100).toFixed(2)}%) Today</h2> 
        }
    }


    const stockQuickStats = () => {
        if (searchLoading === true) {
            return <LoadingSpinner />
            
        // } else if (stockResults.length > 0 && stockHourlyResults.length > 0) {
        } else if (selectedStock.selectedStockStats.length > 0) {
            return (
                <div>
                    <div className="stock-header">
                        <Divider orientation="left"></Divider>
                        {<h1 className="stock-name">{selectedStock.selectedStockStats[0].name} ({selectedStock.selectedStockStats[0].symbol})</h1>} 
                        <br />
                        <h1 className="stock-price">${selectedStock.selectedStockStats[0].price.toFixed(2)}</h1> 
                        <br />
                        {store.getState().selectedStock.selectedStockStats ? chartHeaderPriceStats() : null}
                    </div>
                    {showSelectedPeriodChart()}
                    <br />
                    <ul className="chart-buttons">
                        {chartButtons()}
                    </ul>
                    <br />
                    <br />
                    <Row>
                    <Col span={10} offset={7}>
                        <Divider orientation="left">Key Statistics</Divider>
                    </Col>
                        <Col span={3} offset={7}>
                            <h3 className="h3-left">Market Cap</h3>
                            <h3 className="h3-about-data">{numberFormat(selectedStock.selectedStockStats[0].marketCap)}</h3>
                            <h3 className="h3-left">High today</h3>
                            <h3 className="h3-about-data">${selectedStock.selectedStockStats[0].dayHigh.toFixed(2)}</h3>
                            <h3 className="h3-left">52 Week high</h3>
                            <h3 className="h3-about-data">${selectedStock.selectedStockStats[0].yearHigh.toFixed(2)}</h3>
                        </Col>
                        <Col span={3}>
                            <h3 className="h3-left">Price-Earnings ratio</h3>
                            <h3 className="h3-about-data">{selectedStock.selectedStockStats[0].pe === null ? 0 : selectedStock.selectedStockStats[0].pe.toFixed(2)}</h3>
                            <h3 className="h3-left">Low today</h3>
                            <h3 className="h3-about-data">${selectedStock.selectedStockStats[0].dayLow.toFixed(2)}</h3>
                            <h3 className="h3-left">52 Week low</h3>
                            <h3 className="h3-about-data">${selectedStock.selectedStockStats[0].yearLow.toFixed(2)}</h3>
                        </Col>
                        <Col span={3}>
                            <h3 className="h3-left">Dividend yield</h3>
                            <h3 className="h3-about-data">{selectedStock.selectedStockCompanyInfo[0].lastDiv === 0 ? '-' : selectedStock.selectedStockCompanyInfo[0].lastDiv.toFixed(2)}</h3>
                            <h3 className="h3-left">Open price</h3>
                            <h3 className="h3-about-data">${selectedStock.selectedStockStats[0].open.toFixed(2)}</h3>
                        </Col>
                        <Col span={3}>
                            <h3 className="h3-left">Average volume</h3>
                            <h3 className="h3-about-data">{numberFormat(selectedStock.selectedStockStats[0].avgVolume)}</h3>
                            <h3 className="h3-left">Volume</h3>
                            <h3 className="h3-about-data">{numberFormat(selectedStock.selectedStockStats[0].volume)}</h3>
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <Row>
                        <Col span={10} offset={7}>
                        <Divider orientation="left">About</Divider>
                            <h3 className="h3-about">
                            <ReadMore setIsReadMore={setIsReadMore} isReadMore={isReadMore}>
                                {selectedStock.selectedStockCompanyInfo[0].description}
                            </ReadMore>
                            </h3>  
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <Row>
                        <Col span={3} offset={7}>
                            <h3 className="h3-left">CEO</h3>
                            <h3 className="h3-about-data">{selectedStock.selectedStockCompanyInfo[0].ceo}</h3>
                        </Col>
                        <Col span={3}>
                            <h3 className="h3-left">Employees</h3>
                            <h3 className="h3-about-data">{selectedStock.selectedStockCompanyInfo[0].fullTimeEmployees}</h3>
                        </Col>
                        <Col span={3}>
                            <h3 className="h3-left">Headquarters</h3>
                            <h3 className="h3-about-data">{selectedStock.selectedStockCompanyInfo[0].city !== null ? toTitleCase(selectedStock.selectedStockCompanyInfo[0].city) : null},<br></br> {selectedStock.selectedStockCompanyInfo[0].state !== null ? toTitleCase(selectedStock.selectedStockCompanyInfo[0].state) : null}</h3>
                        </Col>
                        <Col span={3}>
                            <h3 className="h3-left">IPO Date</h3>
                            <h3 className="h3-about-data">{selectedStock.selectedStockCompanyInfo[0].ipoDate}</h3>
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
            )
        } else {
            return null
        }
    }


    return (
         <div className="App">
            <br />
            {asyncSearchBar()}
            {/* <AsyncSearchBar handleSubmit={handleSubmit} onChangeHandle={onChangeHandle} setMostRecentSearch={setMostRecentSearch} mostRecentSearch={mostRecentSearch} options={options} setOptions={setOptions} open={open} setOpen={setOpen} /> */}
            {displayAllStocksTable()}
            {stockQuickStats()}
        </div>
    )
}

export default App
