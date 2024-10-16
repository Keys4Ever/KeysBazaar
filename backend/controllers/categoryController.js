import client from "../config/turso.js";

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const { rows } = await client.execute("SELECT * FROM categories");
        res.json(rows);
    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ error: "Failed to retrieve categories" });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows } = await client.execute({
            sql: "SELECT * FROM categories WHERE id = ?",
            args: [id],
        });

        if (rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error retrieving category:", error);
        res.status(500).json({ error: "Failed to retrieve category" });
    }
};

// Create a new category
const createCategory = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Category name is required" });
    }

    try {
        const result = await client.execute({
            sql: "INSERT INTO categories (name) VALUES (?)",
            args: [name],
        });

        res.status(201).json({ message: "Category created successfully" });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Failed to create category" });
    }
};

// Update an existing category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Category name is required" });
    }

    try {
        const result = await client.execute({
            sql: "UPDATE categories SET name = ? WHERE id = ?",
            args: [name, id],
        });

        if (result.changes === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Failed to update category" });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const transaction = client.transaction("write");

    try {
        (await transaction).execute({
            sql: "DELETE FROM product_categories WHERE category_id = ?",
            args: [id],
        });

        const result = (await transaction).execute({
            sql: "DELETE FROM categories WHERE id = ?",
            args: [id],
        });

        if (result.changes === 0) {
            throw new Error("CategoryNotFound");
        }

        (await transaction).commit();

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        try {
            (await transaction).rollback();
        } catch (rollbackError) {
            console.error("Error during rollback:", rollbackError);
        }

        if (error.message === "CategoryNotFound") {
            res.status(404).json({ message: "Category not found" });
        } else {
            console.error("Error deleting category:", error);
            res.status(500).json({ error: "Failed to delete category" });
        }
    }
};

export { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
