
const SearchBar = ({handleSubmit, mostRecentSearch, setMostRecentSearch}: {handleSubmit: React.FormEventHandler<HTMLFormElement>; mostRecentSearch: string ; setMostRecentSearch: React.Dispatch<React.SetStateAction<string>>} ) => {


    return (
        <div className="search-wrapper">
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="text" value={mostRecentSearch} onChange={(e) => {
                    setMostRecentSearch(e.target.value.toLocaleUpperCase())}}
                    placeholder="Stock Symbol"/>
                <input type="submit" value="Search" />
            </form>                
        </div>
    )

}

export default SearchBar