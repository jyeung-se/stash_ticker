import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import store from '../app/store'


export const getSearchOptions = createAsyncThunk(
  "search/getSearchOptions",
  async () => {
    try {
      const res = await fetch(`https://financialmodelingprep.com/api/v3/search-ticker?query=${store.getState().search.searchValue}&limit=10&apikey=0fbc3128ecb93418721f51d266327cd4`)
      .then((res) => res.json())
      // console.log('typeahead stock symbols', res)
      return res
    } catch (error) {
      console.error(error)
    }
  }
)


export const searchSlice = createSlice({
    name: 'search',
    initialState: {
      optionsLoading: false,
      searchValue: '',
      submittedSearchValue: '',
      typeahead: false,
      searchOptions: [],
    },
    reducers: {
      setTypeaheadOpen: (state) => {state.typeahead = !state.typeahead},
      setSearchValue: (state, action) => {state.searchValue = action.payload},
      setSubmittedSearchValue: (state, action) => {state.submittedSearchValue = action.payload},
      setSearchOptions: (state, action) => {state.searchOptions = action.payload}
    },
    extraReducers: {
      [getSearchOptions.pending]: (state) => {
        state.optionsLoading = true
      },
      [getSearchOptions.fulfilled]: (state, action) => {
        state.optionsLoading = false
        state.searchOptions = action.payload
      },
      [getSearchOptions.rejected]: (state) => {
        state.optionsLoading = false
      }
    }
})

export const { setTypeaheadOpen, setSearchValue, setSubmittedSearchValue, setSearchOptions } = searchSlice.actions

export default searchSlice.reducer