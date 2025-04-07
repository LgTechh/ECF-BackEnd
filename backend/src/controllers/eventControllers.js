import { eventService } from '../services/eventService.js';

export const getAllEvents = async (req, res) => {
    const { periodeId } = req.query; // récupère ?periodeId= depuis l'URL
    try {
        const events = await eventService.getAllEvents(periodeId);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des événements',
            error: error.message
        });
    }
};


// Récupère un événement par son ID
export const getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await eventService.getEventById(id);
        res.status(200).json(event);
    } catch (error) {
        res.status(404).json({ message: 'Événement non trouvé', error: error.message });
    }
};

// Crée un nouvel événement
export const createEvent = async (req, res) => {
    const eventData = req.body;
    console.log("Validation de l'event : ", eventData);

    try {
        const event = await eventService.createEvent(eventData);
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l\'événement', error: error.message });
    }
};


// Met à jour un événement existant
export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const eventData = req.body;
    try {
        const updatedEvent = await eventService.updateEvent(id, eventData);
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'événement', error: error.message });
    }
};

// Supprime un événement
export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await eventService.deleteEvent(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ message: 'Erreur lors de la suppression de l\'événement', error: error.message });
    }
};
