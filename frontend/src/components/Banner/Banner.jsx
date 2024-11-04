import React from "react";
import "./Banner.css";
import useMostPopularProduct from "../../hooks/useMostPopular.js";

const Banner = () => {
    const { popularProducts, error } = useMostPopularProduct(1);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const popularProduct = popularProducts[0];
    if (!popularProduct) {
        return <div>Loading...</div>;
    }

    const backgroundImageUrl = popularProduct.imageUrl || "";

    return (
        <div className="banner">
            <img src={backgroundImageUrl} alt="Popular product background" className="banner-background" />
            <div className="banner-overlay"></div>
            <div className="banner-content">
                <h2>{popularProduct.title}</h2>
                <p>Price: ${popularProduct.price}</p>
            </div>
        </div>
    );
};

export default Banner;
