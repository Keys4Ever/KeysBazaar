import { useParams } from 'react-router-dom';
import { useAuth } from '@context/authContext';
import './ProductPage.css';
import ProductSlider from '@components/ProductSlider/ProductSlider';
import { useEffect, useState } from 'react';
import { addToCart } from '../../services/CartServices';

const ProductPage = () => {
    const { id } = useParams();
    const { auth, loading: authLoading } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const quantity = 1;
   
    
    const retrieveProductFromLocalStorage = () => {
        const localProduct = localStorage.getItem(`product-${id}`);
        setProduct(JSON.parse(localProduct));
        setLoading(false);

        // Maybe this should be used when the user leaves the page 
        // I have putted this because i want to clear the local storage, so it won't have old products.
        clearAllProductsFromLocalStorage();
    }
    const clearAllProductsFromLocalStorage = () => {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('product-')) {
                localStorage.removeItem(key);
            }
        });
    };
    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`);
            if (!response.ok) {
                throw new Error(`Can't find product with id ${id}`);
            }
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if(localStorage.getItem(`product-${id}`)) {
            retrieveProductFromLocalStorage();
        } else {
            fetchProduct();
        }
    }, [id]);

    const userId = auth.authenticated ? auth.user.sub.split('|')[1] : null;

    async function handleAddCartButton() {
        if (product) {
            try {
                const response = await addToCart(userId, id, quantity, product);
                if (response.ok) {
                    alert("Product added to cart successfully!");
                } else {
                    alert("Error adding product to cart");
                }
            } catch (error) {
                alert(`An error occurred: ${error.message}`);
            }
        } else {
            alert("No product selected.");
        }
    }

    window.scrollTo(0, 0);

    if (authLoading || loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found.</div>;
    }

    return (
        <>
            <div className='product-page'>
                <img className='product-image' src={product.imageUrl} alt={product.title} />
                <div className='product-info'>
                    <h1 className='product-title'>{product.title}</h1>
                    <p className='product-price'>Price: ${product.price}</p>
                    <button className='product-button' onClick={handleAddCartButton}>Add to Cart</button>
                    <p className='product-details'>{product.description}</p>
                </div>
            </div>
            <hr/>
            <ProductSlider />
        </>
    );
};

export default ProductPage;
