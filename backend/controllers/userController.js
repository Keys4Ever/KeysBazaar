import client from "../config/turso.js";

// Controller to get all users
const getAllUsers = async (req, res) => {
    try {
        const { rows } = await client.execute("SELECT * FROM users");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve users" });
    }
};

// Controller to get a user
const getUserInfo = async (req, res) => {
    const userId = req.params.userId;
    try {
        const { rows } = await client.execute({
            sql:"SELECT * FROM users WHERE provider_id = ?",
            args: [userId],
        });
        res.json(rows[0]);
    } catch (error) {
        res.status(404).json({ error: "User not found" });
    }
}

export { getAllUsers, getUserInfo };