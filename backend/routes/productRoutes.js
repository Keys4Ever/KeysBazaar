import express from "express";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();
const { getAllProducts, createProduct } = productController;

router.get("/", getAllProducts);
router.post("/", createProduct);
router.put('/:productId', updateProduct)
router.delete("/:productId", deleteProduct);


export default router;