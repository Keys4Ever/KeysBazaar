import React, { useState, useEffect } from 'react';
import ProductCard from '@components/ProductCard/ProductCard';
import { useFetchCategories, useFetchProducts } from './hooks/useFetchData.js';
import SearchBar from './SearchBar/SearchBar.jsx';
import Filters from './Filters/Filters.jsx';
import './CatalogPage.css';

const CatalogPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [page, setPage] = useState(1);

    const { products, more, loading, error, fetchProducts } = useFetchProducts();

    // Fetch categories for filters
    const { categories } = useFetchCategories();

    // Handle search and filter submit
    const handleSearch = () => {
        fetchProducts({
            search: searchQuery,
            categories: selectedCategories,
            minPrice,
            maxPrice,
            limit: 10,
            offset: (page - 1) * 10,
        });
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchProducts({
            search: searchQuery,
            categories: selectedCategories,
            minPrice,
            maxPrice,
            limit: 10,
            offset: (newPage - 1) * 10,
        });
    };

    return (
        <div className="catalog-page">
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
            />
            <Filters
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                onFilter={handleSearch}
            />
            <div className="product-grid">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error loading products</p>
                ) : (
                    products.map(product => (
                        <ProductCard
                            key={product.id}
                            banner={product.imageUrl}
                            name={product.title}
                            price={product.price}
                            productId={product.id}
                            trailer={product.trailerUrl}
                        />
                    ))
                )}
            </div>
            {more && (
                <div className="pagination">
                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                        Previous
                    </button>
                    <span>Page {page}</span>
                    <button onClick={() => handlePageChange(page + 1)}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CatalogPage;
