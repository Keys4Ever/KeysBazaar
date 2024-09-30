import express from "express";
import productController from "../controllers/productController.js";

const router = express.Router();
const { getAllProducts, createProduct } = productController;

router.get("/", getAllProducts);
router.post("/", createProduct);

export default router;