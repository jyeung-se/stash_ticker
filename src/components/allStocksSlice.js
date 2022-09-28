import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


export const getAllStocks = createAsyncThunk(
  "allStocks/getAllStocks",
  async () => {
    try {
      const res = await fetch('https://financialmodelingprep.com/api/v3/stock/list?apikey=0fbc3128ecb93418721f51d266327cd4')
      .then((res) => res.json())
      return res
    } catch (error) {
      console.error(error)
    }
  }
)


export const allStocksSlice = createSlice({
  name: 'allStocks',
  initialState: {
    initialHomePageStocks: [],
    appLoading: false,
  },
  reducers: {
  },
  extraReducers: {
    [getAllStocks.pending]: (state) => {
      state.appLoading = true
    },
    [getAllStocks.fulfilled]: (state, action) => {
      state.appLoading = false
      state.initialHomePageStocks = action.payload
    },
    [getAllStocks.rejected]: (state) => {
      state.appLoading = false
    }
  }
})

// export const { getAllStocks } = allStocksSlice.actions
export default allStocksSlice.reducer