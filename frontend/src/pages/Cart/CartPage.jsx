import React, { useState, useMemo } from 'react';
import mockupCart from '@utils/mockupCart.json';
import mockup from '@utils/mockup.json';
import CartItem from '@components/CartItem/CartItem.jsx';
import './CartPage.css';

const CartPage = () => {
    //userId, here should be auth0 logic
    const userId = "123";

    const [cart, setCart] = useState(() => {
        //retrieve cart, here should be backend shit
        const userCart = mockupCart.find(cart => cart.user_id === userId);
        if (!userCart) {
            return { productsInCart: [], totalPrice: 0 };
        }

        let total = 0;
        //retrieve products, i think this can be better
        const products = userCart.products.map(({ product_id, quantity }) => {
            const productData = mockup.find(product => product.productId === product_id);
            total += productData.price * quantity;
            return { ...productData, quantity };
        });

        return { productsInCart: products, totalPrice: total };
    });

    const { productsInCart, totalPrice } = cart;

    // Handle adding a product
    const handleAdd = (productId) => {
        setCart(prevCart => {
            const updatedProducts = prevCart.productsInCart.map(product => {
                if (product.productId === productId) {
                    return { ...product, quantity: product.quantity + 1 };
                }
                return product;
            });

            // Recalculate total price
            const updatedTotalPrice = updatedProducts.reduce(
                (acc, product) => acc + product.price * product.quantity,
                0
            );

            return { productsInCart: updatedProducts, totalPrice: updatedTotalPrice };
        });
    };

    // Handle reducing a product's quantity
    const handleMinus = (productId) => {
        setCart(prevCart => {
            const updatedProducts = prevCart.productsInCart
                .map(product => {
                    if (product.productId === productId) {
                        return { ...product, quantity: Math.max(product.quantity - 1, 0) };
                    }
                    return product;
                })
                .filter(product => product.quantity > 0); // Remove items with quantity 0

            // Recalculate total price
            const updatedTotalPrice = updatedProducts.reduce(
                (acc, product) => acc + product.price * product.quantity,
                0
            );

            return { productsInCart: updatedProducts, totalPrice: updatedTotalPrice };
        });
    };

    if (productsInCart.length === 0) {
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
                {productsInCart.map((product, index) => (
                    <CartItem
                        key={index}
                        name={product.name}
                        price={product.price}
                        quantity={product.quantity}
                        handleMinus={() => handleMinus(product.productId)}
                        handleAdd={() => handleAdd(product.productId)}
                    />
                ))}
            </ul>
            <div className="total-price">
                <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
            </div>
        </main>
    );
};

export default CartPage;
