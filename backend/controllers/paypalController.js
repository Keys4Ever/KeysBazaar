import client from "../config/turso.js";
import dotenv from 'dotenv';

dotenv.config();

const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

// Function to get the access token
const getPayPalAccessToken = async () => {
    try {
        const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
        const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
            method: 'POST',
            body: 'grant_type=client_credentials',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error getting PayPal access token:', error);
        throw new Error('Failed to authenticate with PayPal');
    }
};

// This has to be refactorized, use transactions, and requesting id's and price from req.
const initiatePayment = async (req, res) => {
    const { provider_id, items } = req.body;
    const transaction = await client.transaction("write");

    try {
        let totalAmount = 0;
        const productDetails = [];

        for (const item of items) {
            const { rows } = await transaction.execute({
                sql: "SELECT price, title FROM products WHERE id = ?",
                args: [item.product_id]
            });

            if (rows.length === 0) {
                throw new Error(`Product ${item.product_id} not found`);
            }

            const product = rows[0];
            totalAmount += product.price * item.quantity;
            productDetails.push({
                ...item,
                title: product.title,
                price: product.price
            });
        }

        // Make order in the db
        const { rows: orderRows } = await transaction.execute({
            sql: "INSERT INTO orders (provider_id, total_price) VALUES (?, ?) RETURNING id",
            args: [provider_id, totalAmount]
        });

        const orderId = orderRows[0].id;

        // Insert items in the order
        for (const item of productDetails) {
            await transaction.execute({
                sql: "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
                args: [orderId, item.product_id, item.quantity, item.price]
            });
        }

        // Make the ppl order with the api.
        const accessToken = await getPayPalAccessToken();
        
        const paypalOrder = {
            intent: "CAPTURE",
            purchase_units: [{
                reference_id: orderId.toString(),
                amount: {
                    currency_code: "USD",
                    value: totalAmount.toString()
                },
                description: `Order ${orderId}`
            }],
            application_context: {
                return_url: 'http://localhost:3000/callback',
                cancel_url: 'http://localhost:3000/callback' //should change it
            }
        };

        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(paypalOrder)
        });

        const paypalResponse = await response.json();

        // Save transaction
        await transaction.execute({
            sql: `INSERT INTO transactions 
                 (order_id, provider, transaction_id, amount, currency, status)
                 VALUES (?, ?, ?, ?, ?, ?)`,
            args: [orderId, 'paypal', paypalResponse.id, totalAmount, 'USD', 'pending']
        });

        await transaction.commit();

        res.json({
            orderId,
            paypalOrderId: paypalResponse.id,
            approvalUrl: paypalResponse.links.find(link => link.rel === 'approve').href
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error initiating payment:", error);
        res.status(500).json({ error: "Failed to initiate payment" });
    }
};

// Confirm payment with ppl api
const capturePayment = async (req, res) => {
    const { paypalOrderId } = req.body;
    const transaction = await client.transaction("write");

    try {
        const accessToken = await getPayPalAccessToken();
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            }
        });

        const paypalResponse = await response.json();
        
        if (paypalResponse.status !== 'COMPLETED') {
            throw new Error('Payment not completed');
        }

        // get the order id from the db
        const referenceId = paypalResponse.purchase_units[0].reference_id;
        const orderId = parseInt(referenceId);

        // Update the transaction status
        await transaction.execute({
            sql: "UPDATE transactions SET status = ? WHERE transaction_id = ?",
            args: ['completed', paypalOrderId]
        });

        // Get the order items
        const { rows: orderItems } = await transaction.execute({
            sql: "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
            args: [orderId]
        });

        // Assing keys for every product
        for (const item of orderItems) {
            const { rows: availableKeys } = await transaction.execute({
                sql: `SELECT id, key FROM product_keys 
                     WHERE product_id = ? 
                     AND id NOT IN (SELECT key_id FROM assigned_keys)
                     LIMIT ?`,
                args: [item.product_id, item.quantity]
            });

            if (availableKeys.length < item.quantity) {
                throw new Error('Insufficient product keys available');
            }

            for (const key of availableKeys) {
                await transaction.execute({
                    sql: "INSERT INTO assigned_keys (order_id, key_id) VALUES (?, ?)",
                    args: [orderId, key.id]
                });
            }
        }

        await transaction.commit();
        
        res.json({
            success: true,
            orderId,
            transactionId: paypalOrderId
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error capturing payment:", error);
        res.status(500).json({ error: "Failed to capture payment" });
    }
};

// get order history
const getOrderHistory = async (req, res) => {
    const { provider_id } = req.params;

    try {
        const { rows: orders } = await client.execute({
            sql: `
                SELECT o.id, o.total_price, o.created_at,
                       t.status as payment_status, t.transaction_id
                FROM orders o
                LEFT JOIN transactions t ON o.id = t.order_id
                WHERE o.provider_id = ?
                ORDER BY o.created_at DESC
            `,
            args: [provider_id]
        });

        // Get details for every order
        for (let order of orders) {
            const { rows: items } = await client.execute({
                sql: `
                    SELECT oi.quantity, oi.price_at_purchase,
                           p.title, p.imageUrl,
                           ak.key as product_key
                    FROM order_items oi
                    JOIN products p ON oi.product_id = p.id
                    LEFT JOIN assigned_keys ak ON oi.order_id = ak.order_id
                    LEFT JOIN product_keys pk ON ak.key_id = pk.id
                    WHERE oi.order_id = ?
                `,
                args: [order.id]
            });
            order.items = items;
        }

        res.json(orders);

    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).json({ error: "Failed to fetch order history" });
    }
};

// Get a order specific details
const getOrderDetails = async (req, res) => {
    const { orderId } = req.params;

    try {
        const { rows: orderDetails } = await client.execute({
            sql: `
                SELECT o.*, t.status as payment_status, t.transaction_id
                FROM orders o
                LEFT JOIN transactions t ON o.id = t.order_id
                WHERE o.id = ?
            `,
            args: [orderId]
        });

        if (orderDetails.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const order = orderDetails[0];

        const { rows: items } = await client.execute({
            sql: `
                SELECT oi.quantity, oi.price_at_purchase,
                       p.title, p.imageUrl,
                       GROUP_CONCAT(pk.key) as product_keys
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                LEFT JOIN assigned_keys ak ON oi.order_id = ak.order_id
                LEFT JOIN product_keys pk ON ak.key_id = pk.id
                WHERE oi.order_id = ?
                GROUP BY oi.id
            `,
            args: [orderId]
        });

        order.items = items;
        res.json(order);

    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Failed to fetch order details" });
    }
};

export {
    initiatePayment,
    capturePayment,
    getOrderHistory,
    getOrderDetails
};