import ProductCard from "@components/ProductCard/ProductCard";
import "./ProductGrid.css"

const ProductGrid = ({ currentProducts = [], gridName = 'undefined', ref }) => {
  return (
    <div className={`${gridName}-grid`} ref={ref}>
      {Array.isArray(currentProducts) && currentProducts.length > 0 ? (
        currentProducts.map((product) => (
          <ProductCard
            imageUrl={product.imageUrl}
            title={product.title}
            price={product.price}
            productId={product.id}
            trailer={product.trailerUrl}
            description={product.description}
            key={product.id}
          />
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};


export default ProductGrid;
