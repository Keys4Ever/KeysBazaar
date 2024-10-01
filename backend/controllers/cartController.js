import client from "../config/turso.js";

async function getProductFromCart(userId, productId){
    const { rows } = await client.execute({
        sql: "SELECT * FROM carts WHERE user_id = ? AND product_id = ?",
        args: [userId, productId],
    });
    return rows[0];
}

// Fetch all cart items for a specific user
const getCartItems = async (req, res) => {
    const { userId } = req.params;

    try {
        const { rows } = await client.execute({
            sql: "SELECT carts.*, products.title, products.price FROM carts JOIN products ON carts.product_id = products.id WHERE carts.user_id = ?",
            args: [userId],
        });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve cart items" });
    }
};

// Add or update an item in the user's cart
const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    
    try {
        const {rows} = await getProductFromCart(userId, productId);

        if (rows.length > 0) {
            // Update quantity if item exists
            await client.execute({
                sql: "UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
                args: [quantity, userId, productId],
            });
            res.status(200).json({ message: "Cart updated successfully" });
        } else {
            // Add new item to cart
            await client.execute({
                sql: "INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)",
                args: [userId, productId, quantity],
            });
            res.status(201).json({ message: "Item added to cart" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to add item to cart" });
    }
};

// Remove or reduce the quantity of an item in the cart
const removeFromCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const { rows } = await getProductFromCart(userId, productId);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Item not found in cart" });
        }

        if (rows[0].quantity > 1) {
            // Reduce quantity if more than one exists
            await client.execute({
                sql: "UPDATE carts SET quantity = quantity - 1 WHERE user_id = ? AND product_id = ?",
                args: [userId, productId],
            });
            res.status(200).json({ message: "Item quantity decreased by 1" });
        } else {
            // Remove item if quantity is one
            await client.execute({
                sql: "DELETE FROM carts WHERE user_id = ? AND product_id = ?",
                args: [userId, productId],
            });
            res.status(200).json({ message: "Item removed from cart successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to remove item from cart" });
    }
};  

// Replace the user's cart with a new set of items
/* Example input:
{
  "userId": 1,
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 3 },
    { "productId": 3, "quantity": 1 }
  ]
}
*/
const replaceCart = async (req, res) => {
    const { userId, items } = req.body;

    try {
        await client.execute({
            sql: "BEGIN",
        });

        // Clear current cart items
        await client.execute({
            sql: "DELETE FROM carts WHERE user_id = ?",
            args: [userId],
        });

        // Insert new items into the cart
        for (const item of items) {
            const { productId, quantity } = item;
            await client.execute({
                sql: "INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)",
                args: [userId, productId, quantity],
            });
        }

        await client.execute({
            sql: "COMMIT",
        });

        res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        await client.execute({
            sql: "ROLLBACK",
        });
        res.status(500).json({ error: "Failed to update cart" });
    }
};

export { getCartItems, addToCart, removeFromCart, replaceCart };
