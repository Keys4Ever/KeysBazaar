import client from "../config/turso.js";

// Controller to get all users
export const getAllUsers = async (req, res) => {
    try {
        const { rows } = await client.execute("SELECT * FROM users");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve users" });
    }
};

// Controller to create a new user
export const createUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        await client.execute({
            sql: "INSERT INTO users (email, password) VALUES (?,?)",
            args: [email, password]
        });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
};


