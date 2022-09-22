import { configureStore } from '@reduxjs/toolkit'
import allStocksReducer from '../components/allStocksSlice'
import selectedStockReducer from '../components/selectedStockSlice'
import appLoadingReducer from  '../components/loadingSlice'
import searchReducer from '../components/searchSlice'


const store = configureStore({
  reducer: {
    totalStocks: allStocksReducer,
    selectedStock: selectedStockReducer,
    appLoading: appLoadingReducer,
    search: searchReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store