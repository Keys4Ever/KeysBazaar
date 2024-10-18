import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaginationControls from '../../components/PaginationControls/PaginationControls';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import './CatalogPage.css';

const CatalogPage = () => {
    const itemsPerPage = 20;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';

    const [currentPage, setCurrentPage] = useState(1);

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
                const total = parseInt(response.headers.get('X-Total-Count'), 10) || 0;
                setTotalProducts(total);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchTerm, currentPage]);

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

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
                        isNextDisabled={currentPage >= totalPages}
                    />
                    <ProductGrid currentProducts={products} className='catalog' />
                    <PaginationControls
                        currentPage={currentPage}
                        handlePreviousPage={handlePreviousPage}
                        handleNextPage={handleNextPage}
                        isNextDisabled={currentPage >= totalPages}
                    />
                </>
            )}
        </div>
    );
};

export default CatalogPage;
