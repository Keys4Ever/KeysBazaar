import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ banner, name, price, productId, trailer }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [videoTime, setVideoTime] = useState(0);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    const handleCardClick = () => navigate(`/product/${productId}`);

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
        <div className="product-card" onClick={handleCardClick}>
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
                        src={banner}
                        alt={`${name} banner`}
                        className="product-banner-image"
                    />
                )}
            </div>
            <div className="product-info">
                <h3 className="product-name">{name}</h3>
                <div className="product-price">{parseFloat(price).toFixed(2)}€</div>
            </div>
        </div>
    );
};

export default ProductCard;
