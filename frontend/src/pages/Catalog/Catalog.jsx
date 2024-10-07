import { useState, useEffect } from 'react';
import mockup from '../../utils/mockup.json'; 
import ProductCard from '../../components/ProductCard/ProductCard';
import "./Catalog.css"

const Catalog = () => {
  const itemsPerPage = 2; // It's supposed to be 20
  
  //#TODO move this to a custom hook "usePagination"
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(mockup);
  }, []);

  // Calcular los productos que se mostrarán en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const handleNextPage = () => {
    if (indexOfLastItem < products.length) {
      window.scrollTo(0,0);
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      window.scrollTo(0,0);
      setCurrentPage(prevPage => prevPage - 1);
    }
  };
 //--------------------
 //#TODO move "pagination-controls" to other component.
  return (
    <div>
      <h1>Catalog</h1>
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={indexOfLastItem >= products.length}>
          Next
        </button>
      </div>
      <div className="catalog-grid">
        {currentProducts.map((product, index) => (
          <ProductCard 
          banner={product.banner}
          name={product.name}
          price={product.price}
          productId={product.productId}
          trailer={product.trailer}
          key={index} 
          />
        ))}
      </div>

      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={indexOfLastItem >= products.length}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Catalog;
