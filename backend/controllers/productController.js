import client from "../config/turso.js";

// Controller to get all products
const getAllProducts = async (req, res) => {
    try {
        const { rows } = await client.execute("SELECT * FROM products");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve products" });
    }
};

// Controller to create a new product
const createProduct = async (req, res) => {
    const { title, description, price } = req.body;

    try {
        await client.execute({
            sql: "INSERT INTO products (title, description, price) VALUES (?,?,?)",
            args: [title, description, price],
        });
        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to create product" });
    }
};

// Controller to delete an existing product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await client.execute({
            sql: "DELETE FROM products WHERE id = ?",
            args: [id],
        });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
    }
};

// Controller to update an existing product
const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { title, description, price } = req.body;

    if (!title || !productId || !description || isNaN(price)) {
        res.status(400).json({ error: "Missing or incorrect arguments" });
    }

    try {
        await client.execute({
            sql: "UPDATE products SET title = ?, description = ?, price = ? WHERE id = ?",
            args: [title, description, price, productId],
        });
        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
    }
};

const getOneProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await client.execute({
            sql: "SELECT * FROM users WHERE id = ?",
            args: [id],
        });
        
        if (rows.length < 1) {
            return res.status(404).json({ error: `Can't find a product with id: ${id}` });
        }
        
        res.status(200).json(rows[0]);
        
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
};


export { getAllProducts, createProduct, deleteProduct, updateProduct, getOneProduct };
