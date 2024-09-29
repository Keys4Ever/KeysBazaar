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
        await client.execute(`INSERT INTO products (title, description, price) VALUES ("${title}", "${description}", "${price}")`);
        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to create product" });
    }
};

export default { getAllProducts, createProduct};