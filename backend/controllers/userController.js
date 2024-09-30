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

// Controller to create a new user
const createUser = async (req, res) => {
    const { email, password, provider, provider_id } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        if (provider && provider_id) {
            // Check if user exists with provider_id
            const { rows: existingUser } = await client.execute({
                sql:"SELECT * FROM users WHERE provider = ? AND provider_id = ?",
                args: [provider, provider_id]
            });

            if (existingUser.length > 0) {
                return res.status(200).json({ message: "OAuth user already exists" });
            }

            // Create new OAuth user
            await client.execute({
                sql: "INSERT INTO users (email, provider, provider_id) VALUES (?,?,?)",
                args: [email, provider, provider_id]
            });
            res.status(201).json({ message: "OAuth user created successfully" });
        } else if (password) {
            // Create traditional user (with password)
            await client.execute({
                sql: "INSERT INTO users (email, password) VALUES (?,?)",
                args: [email, password]
            });
            res.status(201).json({ message: "User created successfully" });
        } else {
            return res.status(400).json({ error: "Password is required for traditional login" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
};

export { getAllUsers, createUser };