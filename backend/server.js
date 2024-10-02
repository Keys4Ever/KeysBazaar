import express from "express";
import { authMiddleware, checkUserInDatabase } from "./middlewares/auth0.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Auth0 middleware for login
app.use(authMiddleware);

// Middleware to check and insert the user in the database
app.use(checkUserInDatabase);

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/", authRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
