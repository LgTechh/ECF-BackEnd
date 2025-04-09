import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { registerValidationRules, loginValidationRules, validate } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post('/register', registerValidationRules, validate, register);

router.post('/login', loginValidationRules, validate, login);

// Route protégée pour récupérer le profil de l'utilisateur
router.get('/profile', authMiddleware, getProfile);

export default router;