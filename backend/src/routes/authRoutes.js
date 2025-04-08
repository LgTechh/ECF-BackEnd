import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

// Route protégée pour récupérer le profil de l'utilisateur
router.get('/profile', authMiddleware, getProfile);

export default router;