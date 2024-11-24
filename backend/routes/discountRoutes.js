import express from "express";
import {
    createDiscount,
    addProductToDiscount,
    updateDiscount,
    getDiscountedProductsId,
    getDiscountForProduct,
    deleteDiscount,
    getDiscounts
} from "../controllers/discountController.js";

const router = express.Router();

router.get("/", getDiscounts);
router.get("/products/:discountId", getDiscountedProductsId);
router.delete('/', deleteDiscount);
router.get("/product/:productId", getDiscountForProduct);
router.post("/", createDiscount);
router.post("/add-product", addProductToDiscount);
router.put("/", updateDiscount);

export default router;