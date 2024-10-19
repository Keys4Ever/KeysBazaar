import { useRef } from "react";
import "./ProductSlider.css";
import products from "@utils/mockup.json";
import ProductGrid from "@components/ProductGrid/ProductGrid.jsx";

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
            <ProductGrid currentProducts={products} gridName="slider" ref={sliderRef}/>
            <button className="slider-button right" onClick={() => handleScroll("right")}>
                &#10095;
            </button>
        </div>
    );
};

export default ProductSlider;