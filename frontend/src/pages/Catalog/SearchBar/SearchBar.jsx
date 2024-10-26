import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => (
    <div className="search-bar">
        <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
        />
        <button onClick={onSearch}>Search</button>
    </div>
);

export default SearchBar;
