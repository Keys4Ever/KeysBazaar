import { useEffect, useState } from 'react';
import mockup from '../../utils/mockup.json';
import PaginationControls from '../../components/PaginationControls/PaginationControls';
import usePagination from '../../hooks/usePagination'; // New hook
import './CatalogPage.css';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../../components/ProductGrid/ProductGrid';

const CatalogPage = () => {
    const itemsPerPage = 20;
    const [products, setProducts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const name =  searchParams.get('search');
    const [searchTerm, setSearchTerm] = useState(name || '');

    useEffect(() => {
        const fetchInitialProducts = async () => {
            try {
                const response = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchInitialProducts();
    }, [searchTerm]); // Refetch when searchTerm changes

    const {
        currentItems: currentProducts,
        currentPage,
        handleNextPage,
        handlePreviousPage,
        isNextDisabled
    } = usePagination(products, itemsPerPage);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setSearchParams({ search: value });
    };

    return (
        <div>
            <h1>Catalog</h1>
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            {searchTerm && <p>Search result for: {searchTerm} </p>}
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
