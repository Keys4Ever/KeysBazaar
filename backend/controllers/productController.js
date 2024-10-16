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

    const transaction = client.transaction("write");

    if (!title || !description || isNaN(price)) {
        return res.status(400).json({ error: "Invalid input. Please provide title, description, and price." });
    }

    try {
        const result = (await transaction).execute({
            sql: "INSERT INTO products (title, description, price, imageUrl, trailerUrl) VALUES (?, ?, ?, ?, ?)",
            args: [title, description, price, imageUrl || null, trailerUrl || null],
        });

        const productId = result.insertId;

        if (Array.isArray(categoryIds) && categoryIds.length > 0) {
            for (const categoryId of categoryIds) {
                (await transaction).execute({
                    sql: "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
                    args: [productId, categoryId],
                });
            }
        }

        (await transaction).commit();

        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        (await transaction).rollback();
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
// #TODO conserveCategories? [default]
// false => delete previous categories
// if categories are passed here, it will add them to the product (product already in that category? continue with next)
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

// Adds a category to a product
// body mode = name/id
// Can pass an array of name/id
const addCategoryToProduct = async (req, res) => {
    const { productId } = req.params;
    const { categoryId, categoryName } = req.body;

    if (!productId) {
        return res.status(400).json({ error: "Missing product ID" });
    }

    if (!categoryId && !categoryName) {
        return res.status(400).json({ error: "Missing category ID or category name" });
    }

    try {
        let resolvedCategoryId = categoryId;

        if (categoryName) {
            const { rows: categoryRows } = await client.execute({
                sql: "SELECT id FROM categories WHERE name = ?",
                args: [categoryName],
            });

            if (categoryRows.length === 0) {
                return res.status(404).json({ error: `Category '${categoryName}' not found` });
            }

            resolvedCategoryId = categoryRows[0].id;
        }

        const { rows: existingRelation } = await client.execute({
            sql: "SELECT * FROM product_categories WHERE product_id = ? AND category_id = ?",
            args: [productId, resolvedCategoryId],
        });

        if (existingRelation.length > 0) {
            return res.status(400).json({ error: "Product is already associated with this category" });
        }

        await client.execute({
            sql: "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
            args: [productId, resolvedCategoryId],
        });

        res.status(201).json({
            message: "Category added to product successfully",
            productId,
            categoryId: resolvedCategoryId,
        });
    } catch (error) {
        console.error("Error adding category to product:", error);
        res.status(500).json({ error: "Failed to add category to product" });
    }
};

export { getAllProducts, createProduct, deleteProduct, updateProduct, getOneProduct, getMostPopularProduct, addCategoryToProduct };
