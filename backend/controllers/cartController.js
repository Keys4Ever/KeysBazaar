import client from "../config/turso.js";

// Get all cart items for a user
export const getCartItems = async (req, res) => {
    const { userId } = req.params;

    try {
        const { rows } = await client.execute({
            sql: "SELECT * FROM carts WHERE user_id = ?",
            args: [userId]
        });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve cart items" });
    }
};

// Add an item to the cart
export const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    // #TODO User should be able to add multiple "same" products to his cart
    try {
        await client.execute({
            sql:"INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)",
            args: [userId, productId, quantity]
        });
        res.status(201).json({ message: "Item added to cart" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add item to cart" });
    }
};

// Remove an item from the cart
export const removeFromCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const result = await client.execute({
            sql: "DELETE FROM carts WHERE user_id =? AND product_id =?",
            args: [userId, productId]
        });

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};