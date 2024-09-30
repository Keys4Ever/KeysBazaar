import express from "express";
import { getAllUsers, getUserInfo } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:userId", getUserInfo)

export default router;
