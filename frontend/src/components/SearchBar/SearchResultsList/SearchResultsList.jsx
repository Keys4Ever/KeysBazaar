import { useNavigate } from "react-router-dom";
import "./SearchResultsList.css";

const SearchResultsList = ({ results }) => {
    const navigate = useNavigate();

    const handleResultClick = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div className="results-list">
            {results.map((result) => (
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
