import express from "express";
import {
    createDiscount,
    addProductToDiscount,
    updateDiscount,
    getDiscountedProductsId,
    getDiscountForProduct,
    getDiscounts
} from "../controllers/discountController.js";

const router = express.Router();

router.get("/", getDiscounts);
router.get("/products/:discountId", getDiscountedProductsId);
router.get("/product/:productId", getDiscountForProduct);
router.post("/", createDiscount);
router.post("/add-product", addProductToDiscount);
router.put("/", updateDiscount);

export default router;