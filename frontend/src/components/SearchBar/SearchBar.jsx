import { useState } from "react";
import searchIcon from "@assets/images/magnifying-glass.svg";
import clearIcon from "@assets/images/clear-search.svg";
import "./SearchBar.css";

const SearchBar = ({ onSearch, onBlur }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value); // Trigger search
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        onSearch(""); // Clear results
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
                onBlur={onBlur} // Call onBlur to hide results
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
