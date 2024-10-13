import client from "../config/turso.js";

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM categories");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve categories.", error });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query("SELECT * FROM categories WHERE id = ?", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Category not found." });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve category.", error });
    }
};

// Create a new category
const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const result = await client.query("INSERT INTO categories (name) VALUES (?)", [name]);
        res.status(201).json({ id: result.lastID, name });
    } catch (error) {
        res.status(500).json({ message: "Failed to create category.", error });
    }
};

// Update an existing category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const result = await client.query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Category not found." });
        }
        res.json({ message: "Category updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to update category.", error });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    const transaction = await client.transaction();

    try {
        await transaction.execute("DELETE FROM product_categories WHERE category_id = ?", [id]);

        const result = await transaction.execute("DELETE FROM categories WHERE id = ?", [id]);
        
        if (result.changes === 0) {
            await transaction.rollback();
            return res.status(404).json({ error: "Category not found" });
        }
        
        await transaction.commit();
        res.status(200).json({ message: "Category deleted successfully and products disassociated" });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: "Failed to delete category" });
    }
};

export { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };