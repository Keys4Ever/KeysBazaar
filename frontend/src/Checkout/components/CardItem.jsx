const CardItem = ({ item }) => {
    //Maybe it should ask for the item.product_id and then retrieve the entire product from back.
    return (
        <div key={Number(item.product_id)} className="cart-item">
            <img 
            src={item.image} 
            alt={item.title} 
            className="item-image"
            />
            <div className="item-details">
            <h3>{item.title}</h3>
            <p>Cantidad: {Number(item.quantity)}</p>
            </div>
            <p className="item-price">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
        </div>
    )
}

export default CardItem;

