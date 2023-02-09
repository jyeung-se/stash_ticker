import React from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';


const AsyncSearchBar = ({handleSubmit, onChangeHandle, mostRecentSearch, setMostRecentSearch, options, setOptions, open, setOpen}: {handleSubmit: React.FormEventHandler<HTMLFormElement>; onChangeHandle: any ; mostRecentSearch: string; setMostRecentSearch: React.Dispatch<React.SetStateAction<string>>; options: []; setOptions: React.Dispatch<any>; open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>} ) => {
  const loading = open && options.length === 0
        
        //save a reference to the TextField component, and use this ref to focus once another element is clicked (once some event was triggered).
        let inputRef

        return (
            <form onSubmit={(e) => handleSubmit(e)} className="async-search-field">
                <button type="submit" className="async-search-button">
                    <img src="search.png" className="async-search-button"/>
                </button>
                <Autocomplete
                    id="asynchronous-demo"
                    style={{ width: 300 }}
                    open={open}
                    onOpen={() => {
                        setOpen(true)
                    }}
                    onClose={() => {
                        setOpen(false)
                    }}
                    onChange={(e) => {
                    }}
                    isOptionEqualToValue={(option: any, value: any) => option.symbol === value.symbol}
                    getOptionLabel={option => option.symbol}
                    options={mostRecentSearch !== "" ? options : [{symbol: '-'}]}
                    loading={loading}
                    disableClearable
                    renderInput={params => (
                        <TextField
                        {...params}
                        label="Search Stock Symbol"
                        variant="standard"
                        onChange={e => {
                            // dont fire API if the input is blank or empty
                            if (e.target.value !== '') {
                                onChangeHandle(e)
                            }
                        }}
                        inputRef={input => {
                            inputRef = input
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                            <React.Fragment>
                                {mostRecentSearch !== "" ? (loading ? <CircularProgress color="inherit" size={20} /> : null) : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                            )
                        }}
                        />
                    )}
                />
            </form>
        )

}

export default AsyncSearchBar