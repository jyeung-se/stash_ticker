import { createSlice } from '@reduxjs/toolkit'

export const selectedStockSlice = createSlice({
  name: 'selectedStock',
  initialState: {
    selectedStock: []
  },
  reducers: {
    getSelectedStock: (state, action) => {
      state.selectedStock = action.payload
    },
  }
})

export const { getSelectedStock } = selectedStockSlice.actions
export default selectedStockSlice.reducer