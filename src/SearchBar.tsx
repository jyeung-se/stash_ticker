
const SearchBar = ({handleSubmit, mostRecentSearch, setMostRecentSearch}: {handleSubmit: React.FormEventHandler<HTMLFormElement>; mostRecentSearch: string ; setMostRecentSearch: React.Dispatch<React.SetStateAction<string>>} ) => {


    return (
        <div className="search-wrapper">
            <form onSubmit={(e) => handleSubmit(e)}>
                <button type="submit" className="search-button">
                    <img src="search.png"/>
                </button>
                <input className="search-field" type="text" value={mostRecentSearch} onChange={(e) => {
                    setMostRecentSearch(e.target.value.toLocaleUpperCase())}}
                    placeholder="Search Stock Symbol"
                />
                {/* <input type="submit" value="Search" /> */}
            </form>                
        </div>
    )

}

export default SearchBar