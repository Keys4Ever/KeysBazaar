import "./SearchResultsList.css";

const SearchResultsList = ({ results }) => {
    return (
        <div className="results-list">
            {results.map((result) => (
                <div key={result.id} className="search-result">
                    {result.title}
                </div>
            ))}
        </div>
    );
};

export default SearchResultsList;
