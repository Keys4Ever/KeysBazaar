import { CardItem, PaymentButton, SetEmailInput } from '../index.js';
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
    const [email, setEmail] = useState(''); 
    const [isEmailValid, setIsEmailValid] = useState(false);   
    useEffect(() => {
        if (loading) return;
            if(auth.authenticated){
                const userId = auth.user.sub.split('|')[1];
                setUserId(userId);
            }
    
            if (localStorage.getItem('localCart') && !auth.authenticated) {
                setCartItems(JSON.parse(localStorage.getItem('localCart')));
            } else {
                if(auth.authenticated){ 
                    getCartItems(userId).then(setCartItems).catch(err => {
                        console.error("Error fetching cart items:", err);
                    });
                }
            }
    }, [loading]);
    
    useEffect(() => {
        console.log(cartItems);
    }, [cartItems]);
    
    useEffect(()=>{
        if(!loading && auth.authenticated){   
            setEmail(auth.user.email)
        }
    },[loading])

    const handlePaypal = async () => {
        if(!email || !isEmailValid){
            alert('The email has to be valid, or log in');
            return;
        }
        const payload = {
            provider_id: auth.authenticated ? String(auth.user.sub.split('|')[1]) : null,
            items: cartItems.map(item => ({
                product_id: Number(item.product_id),
                quantity: Number(item.quantity)
            }))
        };
        console.log(payload)
        const response = await fetch(`http://localhost:3000/api/paypal/initiate?email=${email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        console.log(data)
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
                                <CardItem key={Number(item.product_id)} item={item} />
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
                            {!auth.authenticated && <SetEmailInput setEmail={setEmail} email={email} setIsEmailValid={setIsEmailValid} /> }
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
