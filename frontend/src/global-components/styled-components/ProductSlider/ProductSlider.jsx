import { useRef, useEffect } from "react";
import "./ProductSlider.css";
import { ProductGrid, useProducts } from '@utils/Utils.js';

const ProductSlider = () => {
    const sliderRef = useRef(null);
    const { products, fetchProducts, loading } = useProducts();

    useEffect(() => {
        fetchProducts({});
    }, [fetchProducts]);

    const handleScroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 300;
            if (direction === "left") {
                sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    return (
        <div className="slider-container">
            <button className="slider-button left" onClick={() => handleScroll("left")}>
                &#10094;
            </button>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ProductGrid currentProducts={products} gridName="slider"/>
            )}
            <button className="slider-button right" onClick={() => handleScroll("right")}>
                &#10095;
            </button>
        </div>
    );
};

export default ProductSlider;
