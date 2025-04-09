import express from 'express';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventControllers.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { eventValidationRules, idValidationRules, validate } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Route pour récupérer tous les événements
router.get('/', getAllEvents);

// Route pour créer un événement
router.post('/', authMiddleware, eventValidationRules, validate, createEvent);

// Route pour récupérer un événement par son ID
router.get('/:id',idValidationRules, validate, getEventById);

// Route pour mettre à jour un événement
router.put('/:id',authMiddleware, idValidationRules, eventValidationRules, validate, updateEvent);

// Route pour supprimer un événement
router.delete('/:id', authMiddleware, idValidationRules, validate, deleteEvent);

export default router;