import { CardItem, PaymentButton } from '../index.js';
import { getCartItems } from '../../Cart/index.js';
import { useEffect, useState } from 'react';
import { useAuth } from '@utils/Utils.js';
import '../styles/CheckoutPage.css';

/**
 * #TODO:
 * - Logic to retrieve the key
 * - Logic to handle the response from paypal
 */


const CheckoutPage = () => {
    const { auth, loading } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (loading) return;

        setUserId(auth.user.sub.split('|')[1]);

        if (localStorage.getItem('localCart')) {
            setCartItems(JSON.parse(localStorage.getItem('localCart')));
        } else {
            getCartItems(userId).then(setCartItems);
        }
    }, [auth.authenticated, loading]);

    const handlePaypal = async () => {
        const payload = {
            provider_id: String(auth.user.sub.split('|')[1]),
            items: cartItems.map(item => ({
                product_id: Number(item.product_id),
                quantity: Number(item.quantity)
            }))
        };
        console.log(payload)
        const response = await fetch("http://localhost:3000/api/paypal/initiate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        window.location.href = data.approvalUrl;
    }

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.21;
    const total = subtotal + tax;

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            
            <div className="checkout-grid">
                <div className="cart-section">
                    <div className="card">
                        <h2>Carrito de Compras</h2>
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <CardItem key={item.product_id} item={item} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="payment-section">
                    <div className="card">
                        <h2>Método de Pago</h2>
                        <div className="payment-methods">
                            <PaymentButton text="Crypto" />
                            <PaymentButton text="PayPal" action={handlePaypal}/>

                            <div className="order-summary">
                                <div className="summary-row">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>IVA (21%):</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
