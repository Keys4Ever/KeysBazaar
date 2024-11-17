import client from "../config/turso.js";
import fetch from 'node-fetch';
import sendAssignedKey from "../services/resendServices.js";

const PAYPAL_API = 'https://api-m.sandbox.paypal.com';
const RETURN_URL_BASE = 'http://localhost:3000/api/paypal/capture';
const CANCEL_URL_BASE = 'http://localhost:3000';

// Get PayPal Access Token
async function getPayPalAccessToken() {
    try {
        const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
        const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
            method: 'POST',
            body: 'grant_type=client_credentials',
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) throw new Error('Failed to retrieve PayPal access token');

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error getting PayPal access token:', error);
        throw new Error('PayPal authentication failed');
    }
}

// Create Temporary User if Not Exists
async function tempUser(email) {
    try {
        const { rows } = await client.execute({
            sql: 'SELECT provider_id FROM users WHERE email = ?',
            args: [email],
        });

        if (rows.length > 0) return rows[0].provider_id;

        const provider_id = crypto.randomUUID();

        await client.execute({
            sql: 'INSERT INTO users (email, provider, provider_id) VALUES (?, ?, ?)',
            args: [email, 'not registered', provider_id],
        });

        return provider_id;
    } catch (error) {
        console.error('Error creating or retrieving user:', error);
        throw new Error('Failed to process user data');
    }
}

// Initiate Payment
async function initiatePayment(req, res) {
    const { provider_id: inputProviderId, items } = req.body;
    const { email } = req.query;
    const transaction = await client.transaction("write");

    try {
        const provider_id = String(inputProviderId || await tempUser(email));
        const { totalAmount, productDetails } = await calculateOrderDetails(items, transaction);

        const { rows: orderRows } = await transaction.execute({
            sql: "INSERT INTO orders (provider_id, total_price) VALUES (?, ?) RETURNING id",
            args: [provider_id, totalAmount],
        });
        const orderId = orderRows[0].id;

        await insertOrderItems(orderId, productDetails, transaction);

        const paypalResponse = await createPayPalOrder(orderId, totalAmount, email);
        await saveTransaction(orderId, paypalResponse.id, totalAmount, transaction);

        await transaction.commit();

        res.json({
            orderId,
            paypalOrderId: paypalResponse.id,
            approvalUrl: paypalResponse.links.find(link => link.rel === 'approve').href,
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error initiating payment:", error);
        res.status(500).json({ error: "Failed to initiate payment" });
    }
}

// Helper to Calculate Order Details
async function calculateOrderDetails(items, transaction) {
    let totalAmount = 0;
    const productDetails = [];

    for (const item of items) {
        const { rows } = await transaction.execute({
            sql: "SELECT price, title FROM products WHERE id = ?",
            args: [item.product_id],
        });

        if (rows.length === 0) throw new Error(`Product ${item.product_id} not found`);

        const product = rows[0];
        totalAmount += product.price * item.quantity;
        productDetails.push({
            ...item,
            title: product.title,
            price: product.price,
        });
    }

    return { totalAmount, productDetails };
}

// Helper to Insert Order Items
async function insertOrderItems(orderId, productDetails, transaction) {
    for (const item of productDetails) {
        await transaction.execute({
            sql: "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
            args: [orderId, item.product_id, item.quantity, item.price],
        });
    }
}

// Create PayPal Order
async function createPayPalOrder(orderId, totalAmount, email) {
    const accessToken = await getPayPalAccessToken();

    const paypalOrder = {
        intent: "CAPTURE",
        purchase_units: [{
            reference_id: orderId.toString(),
            amount: {
                currency_code: "USD",
                value: totalAmount.toString(),
            },
            description: `Order ${orderId}`,
        }],
        application_context: {
            return_url: `${RETURN_URL_BASE}?email=${email}`,
            cancel_url: CANCEL_URL_BASE,
        },
    };

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(paypalOrder),
    });

    if (!response.ok) throw new Error('Failed to create PayPal order');

    return await response.json();
}

// Save Transaction Record
async function saveTransaction(orderId, paypalOrderId, totalAmount, transaction) {
    await transaction.execute({
        sql: `INSERT INTO transactions 
              (order_id, provider, transaction_id, amount, currency, status)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [orderId, 'paypal', paypalOrderId, totalAmount, 'USD', 'pending'],
    });
}

// Capture Payment
async function capturePayment(req, res) {
    const { token, email } = req.query;
    const transaction = await client.transaction("write");

    try {
        const accessToken = await getPayPalAccessToken();
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const paypalResponse = await response.json();
        if (paypalResponse.status !== 'COMPLETED') throw new Error('Payment not completed');

        const orderId = parseInt(paypalResponse.purchase_units[0].reference_id);
        await transaction.execute({
            sql: "UPDATE transactions SET status = ? WHERE transaction_id = ?",
            args: ['completed', token],
        });

        const assignedKeys = await assignProductKeys(orderId, transaction);
        await transaction.commit();

        const result = { success: true, orderId, transactionId: token, assignedKeys, email };
        sendAssignedKey(result);

        res.json(result);
    } catch (error) {
        await transaction.rollback();
        console.error("Error capturing payment:", error);
        res.status(500).json({ error: "Failed to capture payment" });
    }
}

// Assign Product Keys
async function assignProductKeys(orderId, transaction) {
    const { rows: orderItems } = await transaction.execute({
        sql: "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
        args: [orderId],
    });

    const assignedKeys = [];

    for (const item of orderItems) {
        const { rows: availableKeys } = await transaction.execute({
            sql: `
                SELECT id, key FROM product_keys 
                WHERE product_id = ? 
                AND id NOT IN (SELECT key_id FROM assigned_keys)
                LIMIT ?`,
            args: [item.product_id, item.quantity],
        });

        if (availableKeys.length < item.quantity) throw new Error('Insufficient product keys available');

        for (const key of availableKeys) {
            await transaction.execute({
                sql: "INSERT INTO assigned_keys (order_id, key_id) VALUES (?, ?)",
                args: [orderId, key.id],
            });
            assignedKeys.push({ product_id: item.product_id, key: key.key });
        }
    }

    return assignedKeys;
}

// Get Order History
async function getOrderHistory(req, res) {
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
            args: [provider_id],
        });

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
                args: [order.id],
            });
            order.items = items;
        }

        res.json(orders);
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).json({ error: "Failed to fetch order history" });
    }
}

// Get Order Details
async function getOrderDetails(req, res) {
    const { order_id } = req.params;

    try {
        const { rows: orderDetails } = await client.execute({
            sql: `
                SELECT oi.quantity, oi.price_at_purchase,
                       p.title, p.imageUrl,
                       pk.key as product_key
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                LEFT JOIN assigned_keys ak ON oi.order_id = ak.order_id
                LEFT JOIN product_keys pk ON ak.key_id = pk.id
                WHERE oi.order_id = ?
            `,
            args: [order_id],
        });

        res.json(orderDetails);
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Failed to fetch order details" });
    }
}

export { initiatePayment, capturePayment, getOrderHistory, getOrderDetails };
