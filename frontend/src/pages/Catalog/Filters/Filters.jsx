import { useState } from "react";

const Filters = ({ categories, onFilterChange }) => {
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter((id) => id !== categoryId)
                : [...prevSelected, categoryId]
        );
    };

    const applyFilters = () => {
        onFilterChange({ minPrice: parseFloat(minPrice), maxPrice: parseFloat(maxPrice), categories: selectedCategories });
    };

    return (
        <div className="filters">
            <div className="price-filter">
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>

            <div className="category-filter">
                {categories.map((category) => (
                    <label key={category.id}>
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                        />
                        {category.name}
                    </label>
                ))}
            </div>
            <button onClick={applyFilters}>Apply Filters</button>
        </div>
    );
};

export default Filters;
