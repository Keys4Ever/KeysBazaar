// SearchBar.jsx
import { useState } from "react";
import searchIcon from "@assets/images/magnifying-glass.svg";
import clearIcon from "@assets/images/clear-search.svg";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmedSearchTerm = searchTerm.trim();
        if (trimmedSearchTerm) {
            onSearch(trimmedSearchTerm);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        onSearch("");
    };

    return (
        <form onSubmit={handleSearchSubmit} className="search-form">
            <button
                type="submit"
                className="search-icon"
                aria-label="Search products"
            >
                <img
                    src={searchIcon}
                    width="20"
                    height="20"
                    alt="Search"
                    aria-hidden="true"
                />
            </button>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
        </form>
    );
};

export default SearchBar;
