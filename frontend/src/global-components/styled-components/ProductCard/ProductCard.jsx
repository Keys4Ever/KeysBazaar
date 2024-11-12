import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ imageUrl, title, price, productId, trailer, description }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [videoTime, setVideoTime] = useState(0);
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const localProductKey = `product-${productId}`;
    const handleCardClick = () => navigate(`/product/${productId}`);
    const [product, setProduct] = useState({
        productId,
        title,
        price,
        description,
        imageUrl
    });
    const saveProduct = () => {
        setProduct({
            productId: productId,
            title: title,
            price: price,
            description: description,
            imageUrl: imageUrl
        });
        localStorage.setItem(localProductKey, JSON.stringify(product));
    }

    const toggleHover = (hovered) => {
        setIsHovered(hovered);
        if (!hovered && videoRef.current) {
            setVideoTime(videoRef.current.currentTime);
            videoRef.current.pause();
        }
    };

    const playVideo = useCallback(() => {

        if (videoRef.current && isHovered) {
            videoRef.current.currentTime = videoTime;
            videoRef.current.play().catch(() => { });
        }
    }, [isHovered, videoTime]);

    useEffect(() => {
        if (isHovered) playVideo();
    }, [isHovered, playVideo]);

    return (
        <div className="product-card" 
        onClick={handleCardClick}
            onMouseEnter={() => saveProduct()}
        >
            <div
                className="product-banner"
                onMouseEnter={() => toggleHover(true)}
                onMouseLeave={() => toggleHover(false)}
            >
                {isHovered && trailer ? (
                    <video
                        ref={videoRef}
                        className="product-trailer"
                        src={trailer}
                        loop
                        muted
                        onLoadedData={playVideo}
                    />
                ) : (
                    <img
                        src={imageUrl}
                        alt={`${title} banner`}
                        className="product-banner-image"
                    />
                )}
            </div>
            <div className="product-info">
                <h3 className="product-name">{title}</h3>
                <div className="product-price">{parseFloat(price).toFixed(2)}€</div>
            </div>
        </div>
    );
};

export default ProductCard;
