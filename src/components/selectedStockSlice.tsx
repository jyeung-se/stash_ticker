import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import store from '../app/store'


export const getSelectedStock: any = createAsyncThunk(
  "selectedStock/getSelectedStock",
  async () => {
    try {
    const [stockData, stockHourlyData, companyProfileData] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/quote/${store.getState().search.submittedSearchValue}?apikey=0fbc3128ecb93418721f51d266327cd4`),
      fetch(`https://financialmodelingprep.com/api/v3/historical-chart/1hour/${store.getState().search.submittedSearchValue}?apikey=0fbc3128ecb93418721f51d266327cd4`),
      fetch(`https://financialmodelingprep.com/api/v3/profile/${store.getState().search.submittedSearchValue}?apikey=0fbc3128ecb93418721f51d266327cd4`)
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
      const stockData = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${store.getState().search.submittedSearchValue}?timeseries=${numberOfDays}&apikey=0fbc3128ecb93418721f51d266327cd4`)
      const stockTimePeriod = await stockData.json()
        .then((data) => {
            return data
        })

      return stockTimePeriod
      // .then((reversedData) => {
      //     setStockPriceDollarChange(store.getState().selectedStock.selectedStockStats[0].price - reversedData[0].close)
      //     setStockPricePercentChange((store.getState().selectedStock.selectedStockStats[0].price - reversedData[0].close) / reversedData[0].close)
      // })
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
    setStockPriceDollarChange: (state, action) => {state.stockPriceDollarChange = action.payload},
    setStockPricePercentChange: (state, action) => {state.stockPricePercentChange = action.payload},
  },
  extraReducers: {
    // [getSelectedStock.pending]: (state) => {
    //   state.searchLoading = true
    // },
    [getSelectedStock.fulfilled]: (state, action) => {
      // state.searchLoading = false
      state.selectedStockStats = action.payload[0]
      state.selectedStockHourlyStats = action.payload[1]
      state.selectedStockCompanyInfo = action.payload[2]
    },
    // [getSelectedStock.rejected]: (state) => {
    //   state.searchLoading = false
    // },

    // [getSelectedStockTimePeriod.pending]: (state) => {
    //   state.searchLoading = true
    // },
    [getSelectedStockTimePeriod.fulfilled]: (state, action) => {
      // state.searchLoading = false
      state.selectedStockTimePeriodStats = action.payload
    },
    // [getSelectedStockTimePeriod.rejected]: (state) => {
    //   state.searchLoading = false
    // }
  }
})

export const { setSearchLoading, setTargetDays, setStockPriceDollarChange, setStockPricePercentChange } = selectedStockSlice.actions
export default selectedStockSlice.reducer

