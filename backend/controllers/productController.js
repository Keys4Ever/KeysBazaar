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

        const categoriesArray = Array.isArray(categories)
            ? categories.map(Number)
            : [parseInt(categories, 10)].filter(n => !isNaN(n));

        let parsedLimit = parseInt(limit, 10);
        let parsedOffset = parseInt(offset, 10);
        let warnings = [];

        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            parsedLimit = null;
            warnings.push("Invalid or no limit provided. Defaulting to no limit.");
        }

        if (isNaN(parsedOffset) || parsedOffset < 0) {
            parsedOffset = 0;
            warnings.push("Invalid or no offset provided. Defaulting to no offset.");
        }

        const { query: filterQuery, params: filterParams } = buildProductFilters({
            search, minPrice, maxPrice, categories: categoriesArray
        });

        let productIdsQuery = `
            SELECT p.id, COUNT(DISTINCT c.id) as matched_categories, COUNT(*) OVER() as found_products_number
            FROM products p
            JOIN product_categories pc ON p.id = pc.product_id
            JOIN categories c ON pc.category_id = c.id
            ${filterQuery}
            GROUP BY p.id
        `;

        if (categoriesArray.length > 0) {
            productIdsQuery += " HAVING matched_categories = ?";
            filterParams.push(categoriesArray.length);
        }

        if (parsedLimit !== null) {
            productIdsQuery += " LIMIT ? OFFSET ?";
            filterParams.push(parsedLimit, parsedOffset);
        }

        const { rows: productIdsRows } = await client.execute(productIdsQuery, filterParams);
        const productIds = productIdsRows.map(row => row.id);
        const totalResults = productIdsRows.length > 0 ? productIdsRows[0].found_products_number : 0;

        if (productIds.length === 0) {
            return res.json({ more: false, products: [], warnings });
        }

        let productQuery = `
            SELECT p.id, p.title, p.description, p.price, p.created_at, p.imageUrl, p.trailerUrl,
                   c.name AS category_name, c.id AS category_id
            FROM products p
            JOIN product_categories pc ON p.id = pc.product_id
            JOIN categories c ON pc.category_id = c.id
            WHERE p.id IN (${productIds.map(() => '?').join(', ')})
            GROUP BY p.id, c.id
        `;

        const productParams = [...productIds];
        const { rows: productRows } = await client.execute(productQuery, productParams);

        // Organize products by ID with categories
        const productsMap = {};
        productRows.forEach(row => {
            if (!productsMap[row.id]) {
                productsMap[row.id] = {
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    price: row.price,
                    created_at: row.created_at,
                    imageUrl: row.imageUrl,
                    trailerUrl: row.trailerUrl,
                    categories: []
                };
            }
            productsMap[row.id].categories.push({ id: row.category_id, name: row.category_name });
        });

        const products = Object.values(productsMap);
        const more = parsedLimit !== null && parsedOffset + parsedLimit < totalResults;

        res.json({
            more,
            products,
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
    const { 
        title, 
        description, 
        price, 
        categoryIds, 
        imageUrl, 
        trailerUrl
    } = req.body;

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
    const {
        title,
        description,
        price,
        imageUrl,
        trailerUrl,
        categoryIds,
        conserveCategories = true
    } = req.body;

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
                SELECT c.id AS category_id, c.name AS category_name
                FROM categories c
                JOIN product_categories pc ON c.id = pc.category_id
                WHERE pc.product_id = ?
            `,
            args: [productId],
        });

        const product = productRows[0];
        product.categories = categoryRows.map(c => ({
            id: c.category_id,
            name: c.category_name
        }));

        res.status(200).json(product);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Updated Controller to get the most popular products with a limit
// #TODO Has to be fixed
const getMostPopularProduct = async (req, res) => {
    const desiredCount = parseInt(req.query.limit) || 1;

    try {
        const { rows: popularRows } = await client.execute(`
            SELECT p.id, p.title, p.description, p.price, p.imageUrl, p.trailerUrl, SUM(oi.quantity) AS total_sold
            FROM products p
            JOIN order_items oi ON p.id = oi.product_id
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT 1
        `);

        let products = [];

        if (popularRows.length > 0) {
            products.push({ ...popularRows[0], order: 1 });
        }

        const remainingCount = desiredCount - products.length;

        if (remainingCount > 0) {
            const { rows: randomRows } = await client.execute(`
                SELECT id, title, description, price, imageUrl, trailerUrl
                FROM products
                WHERE id != ${products[0]?.id || 0} -- Exclude the popular product if it exists
                ORDER BY RANDOM()
                LIMIT ${remainingCount}
            `);

            const randomProductsWithOrder = randomRows.map((product, index) => ({
                ...product,
                order: products.length + index + 1
            }));

            products = products.concat(randomProductsWithOrder);
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching the most popular products:", error);
        res.status(500).json({ error: "Failed to retrieve the most popular products" });
    }
}

// Controller to get all uncategorized products
const getUncategorizedProducts = async (req, res) => {
    try {
        const { rows } = await client.execute(`
            SELECT p.id, p.title
            FROM products AS p
            WHERE p.id NOT IN (
                SELECT DISTINCT pc.product_id
                FROM product_categories AS pc
            );
        `);

        if (rows.length < 1) {
            return res.status(404).json({ message: "No uncategorized products found" });
        }

        res.status(200).json({ products: rows });
    } catch (error) {
        console.error("Error fetching uncategorized products:", error);
        res.status(500).json({ error: "Failed to retrieve uncategorized products" });
    }
};

const getNamesAndIds = async (req, res) => {
    try {
        const { rows } = await client.execute("SELECT id, title FROM products");
        res.status(200).json({ products: rows });
    } catch (error) {
        console.error("Error fetching names and ids:", error);
        res.status(500).json({ error: "Failed to retrieve names and ids" });
    }
}

export { getAllProducts, createProduct, deleteProduct, updateProduct, getOneProduct, getMostPopularProduct, getUncategorizedProducts, getNamesAndIds };