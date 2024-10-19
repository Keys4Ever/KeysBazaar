import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaginationControls from '@components/PaginationControls/PaginationControls';
import ProductGrid from '@components/ProductGrid/ProductGrid';
import usePagination from '@hooks/usePagination';
import './CatalogPage.css';

const CatalogPage = () => {
    const itemsPerPage = 20;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Track errors
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';

    const {
        currentPage,
        handleNextPage,
        handlePreviousPage,
        isNextDisabled,
        isPreviousDisabled,
    } = usePagination(itemsPerPage, products.length);

    const offset = (currentPage - 1) * itemsPerPage;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null); // Reset error on new fetch
            try {
                const response = await fetch(`http://localhost:3000/api/products?search=${encodeURIComponent(searchTerm)}&limit=${itemsPerPage}&offset=${offset}`);
                
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

        fetchProducts();
    }, [searchTerm, currentPage, offset]);

    return (
        <div>
            <h1>Catalog</h1>
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
        </div>
    );
};

export default CatalogPage;