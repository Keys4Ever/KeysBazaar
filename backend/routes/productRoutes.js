import express from "express";
import { getAllProducts, createProduct, updateProduct, deleteProduct, getOneProduct, getMostPopularProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:productId", getOneProduct);
router.put('/:productId', updateProduct);
router.delete("/:productId", deleteProduct);
router.get('/products/most-popular', getMostPopularProduct);

export default router;