import React from 'react';
import ProductCard from "../ProductCard/ProductCard";

const ProductGrid = ({ currentProducts, classname, ref }) => {
  return (
    <div className={`${classname}-grid`} ref={ref}>
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
