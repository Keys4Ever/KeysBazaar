import express from "express";
import cors from "cors";
import { authMiddleware, checkUserInDatabase } from "./middlewares/auth0.js";
import dotenv from "dotenv";

dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();
const port = 3000;;

// CORS (All routes, change later)
const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true
};

app.use(cors(corsOptions));  

app.use(authMiddleware);

app.use(checkUserInDatabase);

app.use(express.json());

app.get("/", (req, res) => {
    res.redirect('http://localhost:5173');
});

app.get("/callback", (req, res) => {
    res.redirect('http://localhost:5173/');
})

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/", authRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
