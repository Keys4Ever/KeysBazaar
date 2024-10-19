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
            try {
                const response = await fetch(`http://localhost:3000/api/products?search=${encodeURIComponent(searchTerm)}&limit=${itemsPerPage}&offset=${offset}`);
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
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
            ) : (
                <>
                    <PaginationControls
                        currentPage={currentPage}
                        handlePreviousPage={handlePreviousPage}
                        handleNextPage={handleNextPage}
                        isNextDisabled={isNextDisabled}
                        isPreviousDisabled={isPreviousDisabled}
                    />
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
