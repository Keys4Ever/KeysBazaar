import './CartItem.css';

const CartItem = ({ name, price, quantity }) => {
    return (
        <li className="cart-item">
            <div className="product-info">
                <h2>{name}</h2>
                <p className="quantity">Quantity: {quantity}</p>
            </div>
            <div className="price-section">
                <p className="price">Price: ${price}</p>
            </div>
        </li>
    );
};

export default CartItem; 