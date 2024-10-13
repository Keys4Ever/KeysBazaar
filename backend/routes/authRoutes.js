import express from 'express';
import { profileController, logoutController, authStatusController, loginController } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', loginController);
router.get('/profile', profileController);
router.get('/auth-status', authStatusController);
router.get('/logout', logoutController);

export default router;