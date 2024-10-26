import { useState, useEffect } from "react";
import ProductCard from "@components/ProductCard/ProductCard";
import SearchBar from "./SearchBar/SearchBar.jsx";
import Filters from "./Filters/Filters.jsx";
import Pagination from "./Pagination/Pagination.jsx";
import useProducts from "./hooks/useProducts.js";
import useCategories from "./hooks/useCategories.js";

const CatalogPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10); // Products per page

    const { products, more, fetchProducts, loading } = useProducts();
    const { categories } = useCategories();

    useEffect(() => {
        console.log("Fetching products for page:", currentPage); // Debug log for pagination
        fetchProducts({
            search: searchQuery,
            minPrice,
            maxPrice,
            categories: selectedCategories,
            limit,
            offset: (currentPage - 1) * limit, // Offset calculation
        });
    }, [searchQuery, minPrice, maxPrice, selectedCategories, currentPage, limit, fetchProducts]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to the first page on search
    };

    const handleFilterChange = ({ minPrice, maxPrice, categories }) => {
        setMinPrice(minPrice);
        setMaxPrice(maxPrice);
        setSelectedCategories(categories);
        setCurrentPage(1); // Reset to the first page on filter change
    };

    const handlePageChange = (page) => {
        if (page > 0) {
            setCurrentPage(page); // Update the current page
        }
    };

    return (
        <div className="catalog-page">
            <SearchBar onSearch={handleSearch} />
            <Filters categories={categories} onFilterChange={handleFilterChange} />

            {loading ? (
                <div>Loading...</div> // Display loading feedback
            ) : (
                <div className="product-grid">
                    {products.length > 0 ? (
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
                    ) : (
                        <div>No products found</div> // No products message
                    )}
                </div>
            )}

            <Pagination currentPage={currentPage} hasNextPage={more} onPageChange={handlePageChange} />
        </div>
    );
};

export default CatalogPage;