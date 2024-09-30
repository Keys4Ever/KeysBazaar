import express from 'express';
import { profileController, logoutController, authStatusController, loginController } from '../controllers/authController.js';

const router = express.Router();

// Route for login
router.get('/login', loginController);

// Protected route for profile
router.get('/profile', profileController);

// Route for checking auth status
router.get('/auth-status', authStatusController);

// Route for logout
router.get('/logout', logoutController);

export default router;