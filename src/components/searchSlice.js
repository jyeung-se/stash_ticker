import { createSlice } from '@reduxjs/toolkit'


export const searchSlice = createSlice({
    name: 'search',
    initialState: {
      searchValue: '',
      submittedSearchValue: '',
    },
    reducers: {
      setSearchValue: (state, action) => {state.searchValue = action.payload},
      setSubmittedSearchValue: (state, action) => {state.submittedSearchValue = action.payload}
    }
})

export const { setSearchValue, setSubmittedSearchValue } = searchSlice.actions

export default searchSlice.reducer