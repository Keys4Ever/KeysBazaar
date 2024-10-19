import React, { useMemo } from 'react';
import mockupCart from '@utils/mockupCart.json';
import mockup from '@utils/mockup.json';
import CartItem from '@components/CartItem/CartItem.jsx';
import './CartPage.css';

const CartPage = () => {
    //userId, here should be auth0 logic
    const userId = "123";

    const userCart = useMemo(() => {
        //retrieve cart, here should be backend shit
        return mockupCart.find(cart => cart.user_id === userId);
    }, [userId]);

    const { productsInCart, totalPrice } = useMemo(() => {
        // if the user doesn't have a cart
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
    }, [userCart]);

    if (!userCart) {
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
