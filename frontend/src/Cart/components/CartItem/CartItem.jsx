import './CartItem.css';

const CartItem = ({ name, price, quantity, handleMinus, handleAdd }) => {

    return (
        <li className="cart-item">
            <div className="product-info">
                <h2>{name}</h2>
                <p className="quantity">Quantity: {quantity}</p>
            </div>
            <div className="price-section">
                <button onClick={handleMinus}> - </button>
                <p className="price">Price: ${price}</p>
                <button onClick={handleAdd}> + </button>
            </div>
        </li>
    );
};

export default CartItem; 