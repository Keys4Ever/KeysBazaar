import React from 'react';
import ProductCard from "../ProductCard/ProductCard";
import "./ProductGrid.css"
const ProductGrid = ({ currentProducts, gridName = 'undefined', ref }) => {
  return (
    <div className={`${gridName}-grid`} ref={ref}>
      {currentProducts.map((product) => (
        <ProductCard
          banner={product.imageUrl}
          name={product.title}
          price={product.price}
          productId={product.id}
          trailer={product.trailerUrl}
          key={product.id}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
