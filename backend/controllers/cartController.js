import client from "../config/turso.js";

const getProductFromCart = async (userId, productId) => {
    try {
        const result = await client.execute({
            sql: "SELECT * FROM carts WHERE provider_id = ? AND product_id = ?",
            args: [userId, productId],
        });
        
        // Verifica que 'result' contenga 'rows' y devuelve un array vacío si no existe
        return result && result.rows ? { rows: result.rows } : { rows: [] };
    } catch (error) {
        console.error("Error retrieving product from cart:", error);
        throw new Error("Failed to retrieve product from cart");
    }
};

// Fetch all cart items for a specific user
const getCartItems = async (req, res) => {
    const { userId } = req.params;

    try {
        const { rows } = await client.execute({
            sql: "SELECT carts.*, products.title, products.price FROM carts JOIN products ON carts.product_id = products.id WHERE carts.provider_id = ?",
            args: [userId],
        });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve cart items" });
    }
};

// Add or update an item in the user's cart
const addToCart = async (req, res) => {
    let { userId, productId, quantity } = req.body;

    userId = String(userId); // I think my aversion to TypeScript is vanishing...

    if (!userId || !productId || quantity <= 0) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    try {
        const result = await getProductFromCart(userId, productId);

        if (result && result.rows.length > 0) {
            // Update quantity if item already exists in cart
            await client.execute({
                sql: "UPDATE carts SET quantity = quantity + ? WHERE provider_id = ? AND product_id = ?",
                args: [quantity, userId, productId],
            });
            res.status(200).json({ message: "Cart updated successfully", ok: true });
        } else {
            // Insert a new item into the cart
            await client.execute({
                sql: "INSERT INTO carts (provider_id, product_id, quantity) VALUES (?, ?, ?)",
                args: [userId, productId, quantity],
            });
            res.status(201).json({ message: "Item added to cart", ok: true });
        }
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: "Failed to add item to cart", ok: false });
    }
};


// Remove or reduce the quantity of an item in the cart
const removeFromCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const { rows } = await getProductFromCart(userId, productId);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Item not found in cart", ok: false });
        }

        if (rows[0].quantity > 1) {
            // Reduce quantity if more than one exists
            await client.execute({
                sql: "UPDATE carts SET quantity = quantity - 1 WHERE provider_id = ? AND product_id = ?",
                args: [userId, productId],
            });
            res.status(200).json({ message: "Item quantity decreased by 1", ok: true });
        } else {
            // Remove item if quantity is one
            await client.execute({
                sql: "DELETE FROM carts WHERE provider_id = ? AND product_id = ?",
                args: [userId, productId],
            });
            res.status(200).json({ message: "Item removed from cart successfully", ok: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to remove item from cart", ok: false });
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
    const transaction = await client.transaction("write");

    try {
        // Clear current cart items
        await transaction.execute({
            sql: "DELETE FROM carts WHERE provider_id = ?",
            args: [userId],
        });

        // Insert new items into the cart
        for (const item of items) {
            const { productId, quantity } = item;
            await client.execute({
                sql: "INSERT INTO carts (provider_id, product_id, quantity) VALUES (?, ?, ?)",
                args: [userId, productId, quantity],
            });
        }
        await transaction.commit();

        res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        res.status(500).json({ error: "Failed to update cart" });
    }
};

export { getCartItems, addToCart, removeFromCart, replaceCart };
