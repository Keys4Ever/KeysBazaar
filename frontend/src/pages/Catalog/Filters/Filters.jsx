import React from 'react';

const Filters = ({
    categories,
    selectedCategories,
    setSelectedCategories,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    onFilter,
}) => {
    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    return (
        <div className="filters">
            <div className="price-filter">
                <label>Min Price:</label>
                <input
                    type="number"
                    value={minPrice || ''}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
                />
                <label>Max Price:</label>
                <input
                    type="number"
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                />
            </div>
            <div className="category-filter">
                <label>Categories:</label>
                {categories.map(category => (
                    <div key={category.id}>
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                        />
                        <label>{category.name}</label>
                    </div>
                ))}
            </div>
            <button onClick={onFilter}>Apply Filters</button>
        </div>
    );
};

export default Filters;
