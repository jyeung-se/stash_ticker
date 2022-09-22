import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


export const getSelectedStock = createAsyncThunk(
  "allStocks/getSelectedStock",
  async () => {
    try {
      // insert correct/UPDATED searched stock fetch below
      const res = await fetch('https://financialmodelingprep.com/api/v3/stock/list?apikey=4672ed38f1e727b95f8a9cbd22574eed')
      .then((res) => res.json())
      return res
    } catch (error) {
      console.error(error)
    }
  }
)


export const selectedStockSlice = createSlice({
  name: 'selectedStock',
  initialState: {
    mostRecentSearchValue: '',
    selectedStock: [],
    searchLoading: false,
  },
  reducers: {
    mostRecentSearchValue: (state, action) => {
      state.mostRecentSearchValue = action.payload
    }
  },
  extraReducers: {
    [getSelectedStock.pending]: (state) => {
      state.searchLoading = true
    },
    [getSelectedStock.fulfilled]: (state, action) => {
      state.searchLoading = false
      state.initialHomePageStocks = action.payload
    },
    [getSelectedStock.rejected]: (state) => {
      state.searchLoading = false
    }
  }
})

// export const { getSelectedStock } = selectedStockSlice.actions
export default selectedStockSlice.reducer

