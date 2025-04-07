import express from 'express';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventControllers.js';

const router = express.Router();

// Route pour récupérer tous les événements
router.get('/', getAllEvents);

// Route pour créer un événement
router.post('/', createEvent);

// Route pour récupérer un événement par son ID
router.get('/:id', getEventById);

// Route pour mettre à jour un événement
router.put('/:id', updateEvent);

// Route pour supprimer un événement
router.delete('/:id', deleteEvent);

export default router;