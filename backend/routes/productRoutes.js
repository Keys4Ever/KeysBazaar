import express from "express";
import productController from "../controllers/productController.js";

const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct } = productController;

router.get("/", getAllProducts);
router.post("/", createProduct);
router.put('/:productId', updateProduct)
router.delete("/:productId", deleteProduct);


export default router;