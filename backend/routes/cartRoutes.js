import express from "express";
import { addToCart, getCartItems, removeFromCart, replaceCart } from "../controllers/cartController.js";

const router = express.Router();

// Get a user's cart items by userId
router.get("/:userId", getCartItems);

// Add a product to a user's cart or update the quantity
router.post("/", addToCart);

// Remove or reduce the quantity of a product in a user's cart
router.delete("/:userId/:productId", removeFromCart);

// Replace the entire cart with a new set of products
router.put("/", replaceCart);

export default router;