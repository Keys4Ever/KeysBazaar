import { useState, useEffect } from "react";
import ProductCard from "@components/ProductCard/ProductCard";
import Filters from "../../components/Filters/Filters.jsx";
import Pagination from "../../components/PaginationControls/Pagination.jsx";
import useProducts from "../../hooks/useProducts.js";
import useCategories from "../../hooks/useCategories.js";

const CatalogPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const { products, more, fetchProducts, loading } = useProducts();
    const { categories } = useCategories();

    useEffect(() => {
        fetchProducts({
            search: searchQuery,
            minPrice,
            maxPrice,
            categories: selectedCategories,
            limit,
            offset: (currentPage - 1) * limit
        });
    }, [searchQuery, minPrice, maxPrice, selectedCategories, currentPage, limit, fetchProducts]);

    const handleFilterChange = ({ searchQuery, minPrice, maxPrice, categories }) => {
        setSearchQuery(searchQuery);
        setMinPrice(minPrice);
        setMaxPrice(maxPrice);
        setSelectedCategories(categories);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page > 0 && (page < currentPage || more)) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="catalog-page">
            <Filters
                categories={categories}
                onFilterChange={handleFilterChange}
            />

            {loading ? (
                <div>Loading...</div>
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
                        <div>No products found</div>
                    )}
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                hasNextPage={more}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default CatalogPage;
