import { useState } from "react";
import searchIcon from "@assets/images/magnifying-glass.svg";
import clearIcon from "@assets/images/clear-search.svg";
import "./SearchBar.css";

const SearchBar = ({ setResults }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = (value) => {
        fetch(`http://localhost:3000/api/products`)
            .then((response) => response.json())
            .then((products) => {
                const filteredResults = products.filter((product) =>
                    product.title.toLowerCase().includes(value.toLowerCase())
                );
                setResults(filteredResults);
            })
            .catch((error) => console.error("Error fetching data:", error));
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            fetchData(value);
        } else {
            setResults([]); // Clear results when search is empty
        }
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setResults([]);
    };

    return (
        <div className="search-form">
            <button className="search-icon" aria-label="Search products">
                <img src={searchIcon} width="20" height="20" alt="Search" aria-hidden="true" />
            </button>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products..."
                aria-label="Search products"
            />
            {searchTerm && (
                <button
                    type="button"
                    className="clear-search"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                >
                    <img
                        src={clearIcon}
                        width="20"
                        height="20"
                        alt="Clear"
                        aria-hidden="true"
                    />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
