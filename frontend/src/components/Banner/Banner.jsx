import React, { useEffect, useState } from "react";
import "./Banner.css";

const Banner = () => {
    const [popularProduct, setPopularProduct] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/products/most-popular")
            .then((response) => response.json())
            .then((data) => setPopularProduct(data))
            .catch((error) =>
                console.error("Error fetching the most popular product:", error)
            );
    }, []);

    if (!popularProduct) {
        return <div>Error</div>;
    }

    //#TODO Use later an img field
    const backgroundImageUrl = "https://gaming-cdn.com/img/products/4378/pcover/1920x620/4378.jpg?v=1683706883";

    return (
        <div
            className="banner"
            style={{
                backgroundImage: `url(${backgroundImageUrl})`,
            }}
        >
            <div className="banner-overlay"></div>
            <div className="banner-content">
                <h2>{popularProduct.title}</h2>
                <p>Price: ${popularProduct.price}</p>
            </div>
        </div>
    );
};

export default Banner;
