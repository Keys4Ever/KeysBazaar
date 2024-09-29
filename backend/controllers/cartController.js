import client from "../config/turso.js";

// Get all cart items for a user
const getCartItems = async (req, res) => {
    const { userId } = req.params;

    try {
        const { rows } = await client.execute(`SELECT * FROM carts WHERE user_id = "${userId}"`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve cart items" });
    }
};

// Add an item to the cart
const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    // #TODO User should be able to add multiple "same" products to his cart
    try {
        await client.execute(`INSERT INTO carts (user_id, product_id, quantity) VALUES ("${userId}", "${productId}", "${quantity}")`);
        res.status(201).json({ message: "Item added to cart" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add item to cart" });
    }
};

// Remove an item from the cart
const removeFromCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const result = await client.execute(`DELETE FROM carts WHERE user_id = "${userId}" AND product_id = "${productId}"`);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};

export default { getCartItems, addToCart, removeFromCart };