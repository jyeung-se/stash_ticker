import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import store from '../app/store'


export const getSelectedStock: any = createAsyncThunk(
  "selectedStock/getSelectedStock",
  async () => {
    try {
    const [stockData, stockHourlyData, companyProfileData] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/quote/${store.getState().search.searchValue}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`),
      fetch(`https://financialmodelingprep.com/api/v3/historical-chart/1hour/${store.getState().search.searchValue}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`),
      fetch(`https://financialmodelingprep.com/api/v3/profile/${store.getState().search.searchValue}?apikey=82c67b0e070a79fd0ab79b7b1987b6ba`)
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



export const selectedStockSlice = createSlice({
  name: 'selectedStock',
  initialState: {
    selectedStockStats: [],
    selectedStockHourlyStats: [],
    SelectedStockCompanyInfo: [],
    searchLoading: false,
  },
  reducers: {
  },
  extraReducers: {
    [getSelectedStock.pending]: (state) => {
      state.searchLoading = true
    },
    [getSelectedStock.fulfilled]: (state, action) => {
      state.searchLoading = false
      console.log(action.payload)
      state.selectedStockStats = action.payload[0]
      state.selectedStockHourlyStats = action.payload[1]
      state.SelectedStockCompanyInfo = action.payload[2]
      console.log(state.selectedStockStats)

    },
    [getSelectedStock.rejected]: (state) => {
      state.searchLoading = false
    }
  }
})

// export const { getSelectedStock } = selectedStockSlice.actions
export default selectedStockSlice.reducer

