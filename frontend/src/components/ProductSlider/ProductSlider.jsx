import { useRef } from "react";
import "./ProductSlider.css";
import ProductCard from "../ProductCard/ProductCard.jsx";
import products from "../../utils/mockup.json";

const ProductSlider = () => {
    const sliderRef = useRef(null);

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
            <div className="slider" ref={sliderRef}>
                {products.map((product) => (
                    <ProductCard
                        key={product.productId}
                        banner={product.banner}
                        name={product.name}
                        price={product.price}
                        productId={product.productId}
                        trailer={product.trailer}
                    />
                ))}
            </div>
            <button className="slider-button right" onClick={() => handleScroll("right")}>
                &#10095;
            </button>
        </div>
    );
};

export default ProductSlider;