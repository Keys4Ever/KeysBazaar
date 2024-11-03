import ProductCard from "@components/ProductCard/ProductCard";
import "./ProductGrid.css"
const ProductGrid = ({ currentProducts, gridName = 'undefined', ref}) => {
  return (
    <div className={`${gridName}-grid`} ref={ref}>
      {currentProducts.map((product) => (
        <ProductCard
          imageUrl={product.imageUrl}
          title={product.title}
          price={product.price}
          productId={product.id}
          trailer={product.trailerUrl}
          description={product.description}
          key={product.id}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
