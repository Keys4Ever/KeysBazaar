import { useState, useEffect } from "react";
import { ProductGrid, useProducts } from "@utils/Utils.js";
import { Pagination, Filters, useCategories } from "../Index.js";

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
                <ProductGrid
                    currentProducts={products}
                    gridName="product"
                />
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
