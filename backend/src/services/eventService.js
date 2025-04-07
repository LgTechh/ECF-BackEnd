import { eventRepository } from '../repositories/eventRepository.js';
import { validerEvent } from '../models/eventModel.js';

export const eventService = {
    // Créer un événement
    createEvent: async (eventData) => {
        console.log("Données reçues dans le service :", eventData);  // Log des données reçues

        // Validation des données
        const { estValide, erreurs } = validerEvent(eventData);

        if (!estValide) {
            console.log("Erreurs de validation :", erreurs);  // Log des erreurs de validation
            throw new Error(`Erreur de validation: ${erreurs.join(', ')}`);
        }

        // Si la validation passe, on appelle le repository pour créer l'événement
        try {
            const createdEvent = await eventRepository.createEvent(eventData);
            console.log("Événement créé avec succès :", createdEvent);  // Log de l'événement créé
            return createdEvent;
        } catch (error) {
            console.error("Erreur lors de la création de l'événement dans le repository", error);
            throw new Error("Erreur lors de la création de l'événement dans le repository");
        }
    },


    // Mettre à jour un événement
    updateEvent: async (id, eventData) => {
        // Validation des données
        const { estValide, erreurs } = validerEvent(eventData);

        if (!estValide) {
            throw new Error(`Erreur de validation: ${erreurs.join(', ')}`);
        }

        // Si la validation passe, on appelle le repository pour mettre à jour l'événement
        return await eventRepository.updateEvent(id, eventData);
    },

    // Récupérer tous les événements
    getAllEvents: async (periodeId) => {
        try {
            if (periodeId) {
                return await eventRepository.getEventsByPeriode(periodeId);
            }
            return await eventRepository.getAllEvents();
        } catch (error) {
            throw new Error('Erreur lors de la récupération des événements');
        }
    },

    // Récupérer un événement par son ID
    getEventById: async (id) => {
        try {
            const event = await eventRepository.getEventById(id);
            return event;
        } catch (error) {
            throw new Error('Événement non trouvé');
        }
    },

    // Supprimer un événement
    deleteEvent: async (id) => {
        try {
            await eventRepository.deleteEvent(id);
            return { message: 'Événement supprimé avec succès' };
        } catch (error) {
            throw new Error('Erreur lors de la suppression de l\'événement');
        }
    }
};
