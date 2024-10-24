import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaginationControls from '@components/PaginationControls/PaginationControls';
import ProductGrid from '@components/ProductGrid/ProductGrid';
import usePagination from '@hooks/usePagination';
import './CatalogPage.css';

const CatalogPage = () => {
    const itemsPerPage = 20;
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // Store available categories
    const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories for filter
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';

    const {
        currentPage,
        handleNextPage,
        handlePreviousPage,
        isNextDisabled,
        isPreviousDisabled,
        setCurrentPage // This is new to allow resetting the page when search is triggered
    } = usePagination(itemsPerPage, products.length);

    const offset = (currentPage - 1) * itemsPerPage;

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    // Function to handle search with filters
    const fetchProducts = async () => {
        setLoading(true);
        setError(null); // Reset error on new fetch
        try {
            const queryParams = new URLSearchParams({
                search: searchTerm,
                minPrice: minPrice || '',
                maxPrice: maxPrice || '',
                categories: selectedCategories.join(',') || '',
                limit: itemsPerPage,
                offset: offset
            });

            const response = await fetch(`http://localhost:3000/api/products?${queryParams.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
            setError('There was an issue fetching products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch products whenever the currentPage, minPrice, maxPrice, or selectedCategories change
    useEffect(() => {
        fetchProducts();
    }, [currentPage, minPrice, maxPrice, selectedCategories]);

    // Handle category selection
    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedCategories(prev => [...prev, value]);
        } else {
            setSelectedCategories(prev => prev.filter(category => category !== value));
        }
    };

    // Handle search button click (reset page to 1 and refetch products)
    const handleSearch = () => {
        setCurrentPage(1);  // Reset to the first page when filters are applied
        fetchProducts();
    };

    return (
        <div>
            <h1>Catalog</h1>
            <div className="filters">
                <div className="filter-group">
                    <label htmlFor="minPrice">Min Price:</label>
                    <input
                        type="number"
                        id="minPrice"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="maxPrice">Max Price:</label>
                    <input
                        type="number"
                        id="maxPrice"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>Categories:</label>
                    {categories.map((category) => (
                        <div key={category.id}>
                            <input
                                type="checkbox"
                                value={category.name}
                                onChange={handleCategoryChange}
                                id={`category-${category.id}`}
                            />
                            <label htmlFor={`category-${category.id}`}>{category.name}</label>
                        </div>
                    ))}
                </div>
                <button onClick={handleSearch}>Search</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : products.length === 0 ? (
                <p>No products found</p>
            ) : (
                <>
                    <ProductGrid currentProducts={products} gridName='catalog' />
                    <PaginationControls
                        currentPage={currentPage}
                        handlePreviousPage={handlePreviousPage}
                        handleNextPage={handleNextPage}
                        isNextDisabled={isNextDisabled}
                        isPreviousDisabled={isPreviousDisabled}
                    />
                </>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default CatalogPage;
