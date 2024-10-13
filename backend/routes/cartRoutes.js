import express from "express";
import { addToCart, getCartItems, removeFromCart, replaceCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCartItems);
router.post("/", addToCart);
router.delete("/:userId/:productId", removeFromCart);
router.put("/", replaceCart);

export default router;