import client from "../config/turso.js";

// Controller to get all products with optional search query
const getAllProducts = async (req, res) => {
    try {
        const { search, minPrice, maxPrice } = req.query;
        const categories = req.query.categories || [];

        let query = `
            SELECT p.*, GROUP_CONCAT(c.name) AS categories
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE 1=1
        `;

        const params = [];

        // Search term filter
        if (search) {
            query += " AND LOWER(p.title) LIKE ?";
            params.push(`%${search.toLowerCase()}%`);
        }

        // Min price filter
        if (minPrice) {
            query += " AND p.price >= ?";
            params.push(minPrice);
        }

        // Max price filter
        if (maxPrice) {
            query += " AND p.price <= ?";
            params.push(maxPrice);
        }

        // Multi-category filter by category names
        if (categories.length > 0) {
            // Expecting categories to be passed as multiple query parameters, example: ?categories=Electronics&categories=Smartphones
            const categoryList = Array.isArray(categories) ? categories : [categories];
            query += ` AND c.name IN (${categoryList.map(() => '?').join(', ')})`;
            params.push(...categoryList);
        }

        query += " GROUP BY p.id";

        const { rows } = await client.execute(query, params);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve products" });
    }
};

// Controller to create a new product
//#TODO Add img field
const createProduct = async (req, res) => {
    const { title, description, price, categoryIds } = req.body;

    if (!title || !description || isNaN(price) || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.status(400).json({ error: "Invalid input. Please provide title, description, price, and at least one category." });
    }

    try {
        const result = await client.execute({
            sql: "INSERT INTO products (title, description, price) VALUES (?, ?, ?)",
            args: [title, description, price],
        });

        const productId = result.insertId;

        for (const categoryId of categoryIds) {
            await client.execute({
                sql: "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
                args: [productId, categoryId],
            });
        }

        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};

// Controller to delete an existing product
const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        await client.execute({
            sql: "DELETE FROM products WHERE id = ?",
            args: [productId],
        });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
    }
};

// Controller to update an existing product
const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { title, description, price, imageUrl, trailerUrl } = req.body;

    if (!title || !productId || !description || isNaN(price)) {
        return res.status(400).json({ error: "Missing or incorrect arguments" });
    }

    try {
        await client.execute({
            sql: "UPDATE products SET title = ?, description = ?, price = ?, imageUrl = ?, trailerUrl = ? WHERE id = ?",
            args: [title, description, price, imageUrl, trailerUrl, productId],
        });
        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
    }
};

// Controller to get an specific product by id
const getOneProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const { rows } = await client.execute({
            sql: "SELECT * FROM products WHERE id = ?", 
            args: [productId],
        });
        
        if (rows.length < 1) {
            return res.status(404).json({ error: `Can't find a product with id: ${productId}` });
        }
        
        res.status(200).json(rows[0]);
        
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error"});
    }
};

// Controller to get the most popular product
const getMostPopularProduct = async (req, res) => {
    try {
        const { rows } = await client.execute(`
            SELECT p.id, p.title, SUM(oi.quantity) AS total_sold
            FROM products p
            JOIN order_items oi ON p.id = oi.product_id
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT 1;
        `);

        if (rows.length < 1) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve the most popular product" });
    }
};

export { getAllProducts, createProduct, deleteProduct, updateProduct, getOneProduct, getMostPopularProduct };
