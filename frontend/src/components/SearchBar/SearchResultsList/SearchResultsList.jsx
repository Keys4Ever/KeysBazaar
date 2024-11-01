import { useNavigate } from "react-router-dom";
import "./SearchResultsList.css";

const SearchResultsList = ({ results, allProducts }) => {
    const navigate = useNavigate();

    const handleResultClick = (id) => {
        navigate(`/product/${id}`);
    };

    const displayResults = results.length > 0 ? results : allProducts;

    return (
        <div className="results-list">
            {displayResults.map((result) => (
                <div
                    key={result.id}
                    className="search-result"
                    onClick={() => handleResultClick(result.id)}
                >
                    {result.title}
                </div>
            ))}
        </div>
    );
};

export default SearchResultsList;
