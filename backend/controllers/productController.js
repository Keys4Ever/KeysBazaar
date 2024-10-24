import client from "../config/turso.js";

// Controller to get all products with optional search query
const getAllProducts = async (req, res) => {
    try {
        const {
            search = '',
            minPrice = null,
            maxPrice = null,
            categories = [],
            limit = 0,
            offset = 0
        } = req.query;

        let parsedLimit = parseInt(limit, 10);
        let parsedOffset = parseInt(offset, 10);
        let warnings = [];

        if (isNaN(parsedLimit) || parsedLimit === 0 || parsedLimit === null) {
            parsedLimit = null;
            warnings.push("Invalid or no limit provided. Defaulting to no limit.");
        }

        if (isNaN(parsedOffset) || parsedOffset < 0) {
            parsedOffset = 0;
            warnings.push("Invalid or no offset provided. Defaulting to no offset.");
        }

        const { query: filterQuery, params: filterParams } = buildProductFilters({ search, minPrice, maxPrice, categories });

        const countQuery = `
            SELECT COUNT(DISTINCT p.id) AS total
            FROM products p
            JOIN product_categories pc ON p.id = pc.product_id
            JOIN categories c ON pc.category_id = c.id
            ${filterQuery}
        `;
        const { rows: countRows } = await client.execute(countQuery, filterParams);
        const totalCount = countRows[0]?.total || 0;

        let productQuery = `
            SELECT p.*, GROUP_CONCAT(c.name) AS categories
            FROM products p
            JOIN product_categories pc ON p.id = pc.product_id
            JOIN categories c ON pc.category_id = c.id
            ${filterQuery}
            GROUP BY p.id
        `;

        const productParams = [...filterParams];

        if (categories.length > 0) {
            productQuery += " HAVING COUNT(DISTINCT c.id) = ?";
            productParams.push(categories.length);
        }

        if (parsedLimit !== null) {
            productQuery += " LIMIT ? OFFSET ?";
            productParams.push(parsedLimit, parsedOffset);
        }

        const { rows } = await client.execute(productQuery, productParams);

        const more = parsedLimit !== null && parsedOffset + parsedLimit < totalCount;

        res.json({
            more,
            products: rows,
            warnings
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to retrieve products." });
    }
};

const buildProductFilters = ({ search, minPrice, maxPrice, categories }) => {
    let query = " WHERE 1=1";
    const params = [];

    if (search && search.trim()) {
        query += " AND LOWER(p.title) LIKE ?";
        params.push(`%${search.toLowerCase()}%`);
    }

    if (minPrice && !isNaN(minPrice)) {
        query += " AND p.price >= ?";
        params.push(minPrice);
    }

    if (maxPrice && !isNaN(maxPrice)) {
        query += " AND p.price <= ?";
        params.push(maxPrice);
    }

    if (Array.isArray(categories) && categories.length > 0) {
        query += ` AND c.id IN (${categories.map(() => '?').join(', ')})`;
        params.push(...categories);
    }

    return { query, params };
};

// Controller to create a new product
const createProduct = async (req, res) => {
    const { title, description, price, categoryIds, imageUrl, trailerUrl } = req.body;

    if (!title || !description || isNaN(price)) {
        return res.status(400).json({ error: "Invalid input. Please provide title, description, and price." });
    }

    const transaction = await client.transaction("write");

    try {
        const result = await transaction.execute({
            sql: "INSERT INTO products (title, description, price, imageUrl, trailerUrl) VALUES (?, ?, ?, ?, ?) RETURNING id",
            args: [title, description, price, imageUrl || null, trailerUrl || null],
        });

        const productId = result.rows[0].id;

        if (Array.isArray(categoryIds) && categoryIds.length > 0) {
            for (const categoryId of categoryIds) {
                await transaction.execute({
                    sql: "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
                    args: [productId, categoryId],
                });
            }
        }

        await transaction.commit();

        res.status(201).json({ message: "Product created successfully", productId });
    } catch (error) {
        await transaction.rollback();
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
    const { title, description, price, imageUrl, trailerUrl, categoryIds, conserveCategories = true } = req.body;

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

    if (fields.length === 0 && !categoryIds) {
        return res.status(400).json({ error: "No fields to update" });
    }

    const transaction = client.transaction("write");

    try {
        if (fields.length > 0) {
            (await transaction).execute({
                sql: `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
                args: [...params, productId],
            });
        }

        if (categoryIds) {
            if (!conserveCategories) {
                (await transaction).execute({
                    sql: `DELETE FROM product_categories WHERE product_id = ?`,
                    args: [productId],
                });
            }

            for (const category of categoryIds) {
                const [existingCategory] = (await transaction).execute({
                    sql: `SELECT 1 FROM product_categories WHERE product_id = ? AND category_id = ?`,
                    args: [productId, category],
                });

                if (!existingCategory.length) {
                    (await transaction).execute({
                        sql: `INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)`,
                        args: [productId, category],
                    });
                }
            }
        }

        (await transaction).commit();

        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        try {
            (await transaction).rollback();
        } catch (rollbackError) {
            console.error("Error during rollback:", rollbackError);
        }

        console.error("Error updating product:", error);
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
