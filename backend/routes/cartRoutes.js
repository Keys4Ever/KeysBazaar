import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();
const { addToCart, getCartItems, removeFromCart } = cartController;

router.get("/:userId", getCartItems);
router.post("/", addToCart);
router.delete("/:userId/:productId", removeFromCart);

export default router;