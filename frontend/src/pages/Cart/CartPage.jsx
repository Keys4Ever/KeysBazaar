import React, { useState, useEffect } from 'react';
import CartItem from '@components/CartItem/CartItem.jsx';
import { useAuth } from '@context/authContext';
import { getCartItems, addToCart, removeFromCart } from '@services/cartServices.js';
import './CartPage.css';

const CartPage = () => {
    const { auth, loading: authLoading } = useAuth();
    const [cart, setCart] = useState({ productsInCart: [], totalPrice: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!auth.authenticated && !authLoading) {
            window.location.href = 'http://localhost:3000/login';
        }
    }, [auth, authLoading]);

    const userId = auth.authenticated ? auth.user.sub.split('|')[1] : null;

    useEffect(() => {
        const fetchCart = async () => {
            if (!userId) return;
            setLoading(true);
            setError(null);

            try {
                const items = await getCartItems(userId);
                const { products, total } = calculateCart(items);
                setCart({ productsInCart: products, totalPrice: total });
            } catch (error) {
                setError("Failed to load cart items.");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [userId]);

    const calculateCart = (items) => {
        let total = 0;
        const products = items.map(item => {
            const product = {
                productId: item.product_id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
            };
            total += product.price * product.quantity;
            return product;
        });
        return { products, total };
    };

    const handleAdd = async (productId) => {
        try {
            await addToCart(userId, productId, 1);
            updateCartState(productId, 1);
        } catch (error) {
            setError("Failed to add item to cart.");
        }
    };

    const handleMinus = async (productId) => {
        try {
            await removeFromCart(userId, productId);
            updateCartState(productId, -1);
        } catch (error) {
            setError("Failed to remove item from cart.");
        }
    };

    const updateCartState = (productId, change) => {
        setCart(prevCart => {
            const updatedProducts = prevCart.productsInCart
                .map(product => product.productId === productId 
                    ? { ...product, quantity: product.quantity + change } 
                    : product
                )
                .filter(product => product.quantity > 0);
            const updatedTotalPrice = updatedProducts.reduce(
                (acc, product) => acc + product.price * product.quantity, 
                0
            );
            return { productsInCart: updatedProducts, totalPrice: updatedTotalPrice };
        });
    };

    return (
        <main className="cart-page">
            <h1>Your Cart</h1>
            {loading && <p className="message loading">Loading cart...</p>}
            {error && <p className="message error">{error}</p>}
            {!loading && cart.productsInCart.length === 0 && <p className="message">Your cart is empty.</p>}

            <ul className="cart-products">
                {cart.productsInCart.map((product) => (
                    <CartItem
                        key={product.productId}
                        name={product.title}
                        price={product.price}
                        quantity={product.quantity}
                        handleMinus={() => handleMinus(product.productId)}
                        handleAdd={() => handleAdd(product.productId)}
                    />
                ))}
            </ul>
            <div className="total-price">
                <h3>Total: ${cart.totalPrice.toFixed(2)}</h3>
            </div>
        </main>
    );
};

export default CartPage;
