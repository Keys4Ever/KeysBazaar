import { useEffect, useState } from 'react';
import mockup from '../../utils/mockup.json';
import PaginationControls from '../../components/PaginationControls/PaginationControls';
import usePagination from '../../hooks/usePagination'; // New hook
import './CatalogPage.css';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../../components/ProductGrid/ProductGrid';

const CatalogPage = () => {
    const itemsPerPage = 3; // Corrected to 20 items
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const name =  searchParams.get('search');
    console.log(name)
    useEffect(() => {
        if(name){
            const filteredProducts = mockup.filter(product => 
                product.name.toLowerCase().includes(name.toLowerCase())
            );
            setProducts(filteredProducts);
        }else{
            setProducts(mockup);
        }
    }, []);

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
            {name && <p>Search result for: {name} </p>}
            <PaginationControls
                currentPage={currentPage}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                isNextDisabled={isNextDisabled}
            />
            <ProductGrid currentProducts={currentProducts} classname='catalog'/>
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
