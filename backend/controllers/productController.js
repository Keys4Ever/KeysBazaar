import client from "../config/turso.js";
 
// Controller to get all products with optional search query
const getAllProducts = async (req, res) => {
    try {
        const { search, minPrice, maxPrice, categories = [] } = req.query;

        let query = `
            SELECT p.*, GROUP_CONCAT(c.name) AS categories
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE 1=1
        `;

        const params = [];

        // Search term filter
        if (search && search.trim()) {
            query += " AND LOWER(p.title) LIKE ?";
            params.push(`%${search.toLowerCase()}%`);
        }

        // Min price filter
        if (minPrice && !isNaN(minPrice)) {
            query += " AND p.price >= ?";
            params.push(minPrice);
        }

        // Max price filter
        if (maxPrice && !isNaN(maxPrice)) {
            query += " AND p.price <= ?";
            params.push(maxPrice);
        }

        // Multi-category filter by category names
        if (Array.isArray(categories) && categories.length > 0) {
            query += ` AND c.name IN (${categories.map(() => '?').join(', ')})`;
            params.push(...categories);
        }

        query += " GROUP BY p.id";

        const { rows } = await client.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve products" });
    }
};

// Controller to create a new product
const createProduct = async (req, res) => {
    const { title, description, price, categoryIds, imageUrl, trailerUrl } = req.body;

    if (!title || !description || isNaN(price) || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.status(400).json({ error: "Invalid input. Please provide title, description, price, and at least one category." });
    }

    try {
        await client.execute("BEGIN");

        const result = await client.execute({
            sql: "INSERT INTO products (title, description, price, imageUrl, trailerUrl) VALUES (?, ?, ?, ?, ?)",
            args: [title, description, price, imageUrl || null, trailerUrl || null],
        });

        const productId = result.insertId;

        for (const categoryId of categoryIds) {
            await client.execute({
                sql: "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
                args: [productId, categoryId],
            });
        }

        await client.execute("COMMIT");

        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        await client.execute("ROLLBACK");
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

    if (!productId) {
        return res.status(400).json({ error: "Missing product ID" });
    }

    const fields = [];
    const params = [];

    if (title) {
        fields.push("title = ?");
        params.push(title);
    }

    if (description) {
        fields.push("description = ?");
        params.push(description);
    }

    if (price && !isNaN(price)) {
        fields.push("price = ?");
        params.push(price);
    }

    if (imageUrl) {
        fields.push("imageUrl = ?");
        params.push(imageUrl);
    }

    if (trailerUrl) {
        fields.push("trailerUrl = ?");
        params.push(trailerUrl);
    }

    if (fields.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
    }

    params.push(productId);

    try {
        await client.execute({
            sql: `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
            args: params,
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
        const { rows: productRows } = await client.execute({
            sql: "SELECT * FROM products WHERE id = ?",
            args: [productId],
        });

        if (productRows.length < 1) {
            return res.status(404).json({ error: `Can't find a product with id: ${productId}` });
        }

        const { rows: categoryRows } = await client.execute({
            sql: `
                SELECT c.name
                FROM categories c
                JOIN product_categories pc ON c.id = pc.category_id
                WHERE pc.product_id = ?
            `,
            args: [productId],
        });

        const product = productRows[0];
        product.categories = categoryRows.map(c => c.name);

        res.status(200).json(product);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to get the most popular product
const getMostPopularProduct = async (req, res) => {
    try {
        const { rows } = await client.execute(`
            SELECT p.id, p.title, p.description, p.price, p.imageUrl, p.trailerUrl, SUM(oi.quantity) AS total_sold
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
