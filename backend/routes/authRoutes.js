
import express from 'express';
import { profileController, logoutController, authStatusController } from '../controllers/authController.js';

const router = express.Router();

// Ruta protegida para el perfil
router.get('/profile', profileController);

// Ruta para obtener el estado de autenticación
router.get('/auth-status', authStatusController);

// Ruta para cerrar sesión
router.get('/logout', logoutController);

export default router;