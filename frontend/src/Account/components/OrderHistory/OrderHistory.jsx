import "./OrderHistory.css";

const OrderHistory = () => {
    const orders = [
        { id: 1, date: "2024-09-25", total: "$29.99", status: "Delivered" },
        { id: 2, date: "2024-09-14", total: "$19.99", status: "Processing" },
        { /* Example data :) */}
    ];

    return (
        <div className="order-history">
            <h2>Your Order History</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        <span>{order.date} </span>
                        <span>{order.total} </span>
                        <span>{order.status} </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderHistory;