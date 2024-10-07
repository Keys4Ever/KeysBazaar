import { useEffect, useState } from 'react';
import mockup from '../../utils/mockup.json';
import ProductCard from '../../components/ProductCard/ProductCard';
import PaginationControls from '../../components/PaginationControls/PaginationControls';
import usePagination from '../../hooks/usePagination'; // New hook
import './Catalog.css';
import { useSearchParams } from 'react-router-dom';

const Catalog = () => {
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
    } = usePagination(products, itemsPerPage); // I dont know if this is how you use hooks

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
            <div className="catalog-grid">
                {currentProducts.map((product) => (
                    <ProductCard
                        banner={product.banner}
                        name={product.name}
                        price={product.price}
                        productId={product.productId}
                        trailer={product.trailer}
                        key={product.productId}
                    />
                ))}
            </div>
            <PaginationControls
                currentPage={currentPage}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                isNextDisabled={isNextDisabled}
            />
        </div>
    );
};

export default Catalog;
