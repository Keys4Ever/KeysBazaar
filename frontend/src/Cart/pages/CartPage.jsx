import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@utils/Utils.js";
import { CartItem ,getCartItems, addToCart, removeFromCart } from '../index.js';
import '../styles/CartPage.css';

const CartPage = () => {
    const { auth, loading: authLoading } = useAuth();
    const [cart, setCart] = useState({ productsInCart: [], totalPrice: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userId = auth.authenticated ? auth.user.sub.split('|')[1] : null;
    const localCartKey = 'localCart';

    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            setError(null);

            try {
                const items = userId ? await getCartItems(userId) : JSON.parse(localStorage.getItem(localCartKey)) || [];
                const { products, total } = calculateCart(items);
                setCart({ productsInCart: products, totalPrice: total });
            } catch {
                setError("Failed to load cart items.");
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [userId]);

    const calculateCart = (items) => {
        let total = 0;
        const products = items.map(item => {
            const productTotal = item.price * item.quantity;
            total += productTotal;
            return { 
                productId: item.product_id, 
                title: item.title, 
                price: item.price, 
                quantity: item.quantity 
            };
        });
        return { products, total };
    };

    const handleAdd = async (productId) => await updateCartQuantity(productId, 1, addToCart);
    const handleMinus = async (productId) => await updateCartQuantity(productId, -1, removeFromCart);

    const updateCartQuantity = async (productId, change, serviceFunc) => {
        try {
            if (userId) await serviceFunc(userId, productId, Math.abs(change));
            updateCartState(productId, change);
        } catch {
            setError(`Failed to ${change > 0 ? 'add' : 'remove'} item from cart.`);
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

            const updatedTotalPrice = updatedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);
            const updatedCart = { productsInCart: updatedProducts, totalPrice: updatedTotalPrice };

            if (!userId) localStorage.setItem(localCartKey, JSON.stringify(updatedProducts));

            return updatedCart;
        });
    };

    const handleCheckout = () => {
        if (auth.authenticated) {
            navigate('/checkout');
        } else {
            /* navigate('/login');  #TODO: add a Login page - Or only use auth0 one*/
            window.location.href = 'http://localhost:3000/login';
        }
    };

    return (
        <main className="cart-page">
            <h1>Your Cart</h1>
            {loading ? (
                <p className="message loading">Loading cart...</p>
            ) : error ? (
                <p className="message error">{error}</p>
            ) : cart.productsInCart.length === 0 ? (
                <p className="message">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="cart-products">
                        {cart.productsInCart.map(product => (
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
                    <button className="checkout-button" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                </>
            )}
        </main>
    );
};

export default CartPage;
