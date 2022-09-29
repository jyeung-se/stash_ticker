import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import store from '../app/store'


export const getSelectedStock: any = createAsyncThunk(
  "selectedStock/getSelectedStock",
  async () => {
    try {
    const [stockData, stockHourlyData, companyProfileData] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/quote/${store.getState().search.submittedSearchValue}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`),
      fetch(`https://financialmodelingprep.com/api/v3/historical-chart/1hour/${store.getState().search.submittedSearchValue}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`),
      fetch(`https://financialmodelingprep.com/api/v3/profile/${store.getState().search.submittedSearchValue}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
    ])

    const stocks = await stockData.json()
    const stockHourly = await stockHourlyData.json()
    const companyProfile = await companyProfileData.json()

    return [stocks, stockHourly, companyProfile]
    } catch (error) {
      console.error(error)
    }
  }
)


export const getSelectedStockTimePeriod: any = createAsyncThunk(
  "selectedStock/getSelectedStockTimePeriod",
  async () => {
    const chartButtonDays =  
    [
        {period: '1W', days: 7},
        {period: '1M', days: 30},
        {period: '3M', days: 90},
        {period: '6M', days: 180},
        {period: '1Y', days: 365}
    ]
    
    let numberOfDays

    chartButtonDays.map((time) => {
        if (time.period === store.getState().selectedStock.targetDays) {
            numberOfDays = time.days
        }
    })

    try {
      const stockData = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${store.getState().search.submittedSearchValue}?timeseries=${numberOfDays}&apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
      const stockTimePeriod = await stockData.json()
        .then((data) => {
          // console.log(data)
            return data.historical.reverse()
        })

      return stockTimePeriod

        // dispatch(setStockPriceDollarChange(selectedStock.selectedStockStats[0].price - selectedStock.selectedStockTimePeriodStats[0].close))
        // dispatch(setStockPriceDollarChange((selectedStock.selectedStockStats[0].price - selectedStock.selectedStockTimePeriodStats[0].close) / selectedStock.selectedStockTimePeriodStats[0].close))
    } catch (error) {
      console.error(error)
    }
  }
)


export const selectedStockSlice = createSlice({
  name: 'selectedStock',
  initialState: {
    searchLoading: false,
    selectedStockStats: [],
    selectedStockHourlyStats: [],
    selectedStockCompanyInfo: [],
    selectedStockTimePeriodStats: [],
    targetDays: '1D',
    stockPriceDollarChange: 0,
    stockPricePercentChange: 0,
  },
  reducers: {
    setSearchLoading: (state) => {state.searchLoading = !state.searchLoading},
    setTargetDays: (state, action) => {state.targetDays = action.payload},
    setStockPriceDollarChange: (state: any) => {
      // if (state.targetDays !== '1D') {
        state.stockPriceDollarChange = state.selectedStockStats[0].price - state.selectedStockTimePeriodStats[0].close
      // } else {
      //   state.stockPriceDollarChange = state.stockPriceDollarChange
      // }
    },
    setStockPricePercentChange: (state: any) => {
      // if (state.targetDays !== '1D') {
      state.stockPricePercentChange = (state.selectedStockStats[0].price - state.selectedStockTimePeriodStats[0].close) / state.selectedStockTimePeriodStats[0].close
      // } else {
      //   state.stockPricePercentChange = state.stockPricePercentChange
      // }
    },
  },
  extraReducers: {
    // [getSelectedStock.pending]: (state) => {
    //   state.searchLoading = true
    // },
    [getSelectedStock.fulfilled]: (state, action) => {
      // state.searchLoading = false
      console.log(action.payload)
      state.selectedStockStats = action.payload[0]
      state.selectedStockHourlyStats = action.payload[1]
      state.selectedStockCompanyInfo = action.payload[2]
    },
    [getSelectedStock.rejected]: (state) => {
      state.searchLoading = false
    },

    // [getSelectedStockTimePeriod.pending]: (state) => {
    //   state.searchLoading = true
    // },
    [getSelectedStockTimePeriod.fulfilled]: (state, action) => {
      // state.searchLoading = false
      console.log(action.payload)
      state.selectedStockTimePeriodStats = action.payload
    },
    [getSelectedStockTimePeriod.rejected]: (state) => {
      state.searchLoading = false
    }
  }
})

export const { setSearchLoading, setTargetDays, setStockPriceDollarChange, setStockPricePercentChange } = selectedStockSlice.actions
export default selectedStockSlice.reducer

