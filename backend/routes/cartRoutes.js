import express from "express";
import { addToCart, getCartItems, removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCartItems);
router.post("/", addToCart);
router.delete("/:userId/:productId", removeFromCart);

export default router;