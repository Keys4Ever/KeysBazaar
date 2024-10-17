import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import usePagination from '../../hooks/usePagination'; // New hook
import PaginationControls from '../../components/PaginationControls/PaginationControls';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import './CatalogPage.css';

const CatalogPage = () => {
    const itemsPerPage = 20;
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/products?search=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchProducts();
    }, [searchTerm]); // Refetch when searchTerm changes

    const {
        currentItems: currentProducts,
        currentPage,
        handleNextPage,
        handlePreviousPage,
        isNextDisabled
    } = usePagination(products, itemsPerPage);

    return (
        <div>
            <h1>Catalog</h1>
            {searchTerm && <p>Search result for: {searchTerm}</p>}
            <PaginationControls
                currentPage={currentPage}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                isNextDisabled={isNextDisabled}
            />
            <ProductGrid currentProducts={currentProducts} className='catalog' />
            <PaginationControls
                currentPage={currentPage}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                isNextDisabled={isNextDisabled}
            />
        </div>
    );
};

export default CatalogPage;
