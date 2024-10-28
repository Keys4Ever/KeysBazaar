import React, { useState, useEffect } from 'react';
import CartItem from '@components/CartItem/CartItem.jsx';
import { useAuth } from '@context/authContext';
import { getCartItems, addToCart, removeFromCart } from '@services/cartServices.js';
import './CartPage.css';

const CartPage = () => {
    const { auth } = useAuth();

    if (!auth.authenticated) {
        window.location.href = 'http://localhost:3000/login';
    }

    //This has to be changed when the db has the fk with the provider_id
    const userId = 8;
    const [cart, setCart] = useState({ productsInCart: [], totalPrice: 0 });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const items = await getCartItems(userId);
                let total = 0;
                const products = [];

                //maybe this works, idk
                for (const item of items) {
                    const product = {
                        productId: item.product_id,
                        title: item.title,
                        price: item.price,
                        quantity: item.quantity,
                    };

                    total += product.price * product.quantity;
                    products.push(product);
                }

                setCart({ productsInCart: products, totalPrice: total });
            } catch (error) {
                console.error("Failed to load cart items:", error);
            }
        };

        fetchCart();
    }, [userId]);

    const handleAdd = async (productId) => {
        try {
            await addToCart(userId, productId, 1);
            updateCartState(productId, 1);
        } catch (error) {
            console.error("Failed to add item to cart:", error);
        }
    };

    const handleMinus = async (productId) => {
        try {
            await removeFromCart(userId, productId);
            updateCartState(productId, -1);
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
        }
    };

    const updateCartState = (productId, change) => {
        setCart(prevCart => {
            const updatedProducts = prevCart.productsInCart.map(product => {
                if (product.productId === productId) {
                    return { ...product, quantity: product.quantity + change };
                }
                return product;
            }).filter(product => product.quantity > 0);

            const updatedTotalPrice = updatedProducts.reduce(
                (acc, product) => acc + product.price * product.quantity,
                0
            );

            return { productsInCart: updatedProducts, totalPrice: updatedTotalPrice };
        });
    };

    if (cart.productsInCart.length === 0) {
        return (
            <main className="cart-page">
                <h1>Cart page</h1>
                <p>No items in the cart for this user.</p>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <h1>Cart page</h1>
            <ul className="cart-products">
                {cart.productsInCart.map((product, index) => (
                    <CartItem
                        key={index}
                        name={product.title}
                        price={product.price}
                        quantity={product.quantity}
                        handleMinus={() => handleMinus(product.productId)}
                        handleAdd={() => handleAdd(product.productId)}
                    />
                ))}
            </ul>
            <div className="total-price">
                <h3>Total Price: ${cart.totalPrice.toFixed(2)}</h3>
            </div>
        </main>
    );
};

export default CartPage;
