import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();
const { getAllUsers, createUser } = userController;

router.get("/", getAllUsers);
router.post("/", createUser);

export default router;
