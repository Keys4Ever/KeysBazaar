import React from 'react';
import ProductCard from "../ProductCard/ProductCard";

const ProductGrid = ({ currentProducts, classname, ref }) => {
  return (
    <div className={`${classname}-grid`} ref={ref}>
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
  );
};

export default ProductGrid;
