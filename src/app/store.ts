import { configureStore } from '@reduxjs/toolkit'
import allStocksReducer from '../components/allStocksSlice'
import selectedStockReducer from '../components/selectedStockSlice'
import appLoadingReducer from  '../components/loadingSlice'


const store = configureStore({
  reducer: {
    totalStocks: allStocksReducer,
    selectedStock: selectedStockReducer,
    appLoading: appLoadingReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store