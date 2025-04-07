import { openDb } from '../../config/db.js';
import { creerEvent } from '../models/eventModel.js';

export const eventRepository = {
    // Récupère tous les événements
    getAllEvents: async () => {
        const db = await openDb();
        try {
            const eventsData = await db.all(`SELECT * 
                                             FROM Evenement`);

            // Transformer les données brutes en utilisant le modèle
            const events = eventsData.map(event => creerEvent(
                event.id,
                event.titre,
                event.description,
                event.date,
                event.lien,
                event.image_url,
                event.periode_id
            ));

            return events;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des événements');
        }
    },

    getEventsByPeriode: async (periodeId) => {
        const db = await openDb();
        try {
            const numericPeriodeId = Number(periodeId);
            const eventsData = await db.all(`SELECT
            Evenement.id,
                Evenement.titre,
                Evenement.description,
                Evenement.date,
                Evenement.lien,
                Evenement.image_url,
                Evenement.periode_id,
                Periode.nom AS periode_nom 
            FROM
            Evenement
            INNER JOIN
            Periode ON Evenement.periode_id = Periode.id
            WHERE
            Evenement.periode_id = ?`, [numericPeriodeId]);

            const events = eventsData.map(event => creerEvent(
                event.id,
                event.titre,
                event.description,
                event.date,
                event.lien,
                event.image_url,
                event.periode_id,
                event.periode_nom
            ));

            return events;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des événements par période');
        }
    },

    // Récupère un événement par ID
    getEventById: async (id) => {
        const db = await openDb();
        try {
            const eventData = await db.get('SELECT * FROM Evenement WHERE id = ?', [id]);
            if (!eventData) {
                throw new Error('Événement non trouvé');
            }

            // Retourner un événement correctement formaté
            return creerEvent(
                eventData.id,
                eventData.titre,
                eventData.description,
                eventData.date,
                eventData.lien,
                eventData.image_url,
                eventData.periode_id
            );
        } catch (error) {
            throw error;
        }
    },

    // Crée un nouvel événement
    createEvent: async (eventData) => {
        const db = await openDb();
        try {
            const { titre, description, date, lien, image_url, periode_id } = eventData;

            const result = await db.run(
                `INSERT INTO Evenement (titre, description, date, lien, image_url, periode_id)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [titre, description, date, lien, image_url, periode_id]
            );

            // Retourner un événement correctement formaté
            return creerEvent(
                result.lastID,
                titre,
                description,
                date,
                lien,
                image_url,
                periode_id
            );
        } catch (error) {
            throw new Error('Erreur lors de la création de l\'événement');
        }
    },

    // Met à jour un événement existant
    updateEvent: async (id, eventData) => {
        const db = await openDb();
        try {
            const { titre, description, date, lien, image_url, periode_id } = eventData;

            const result = await db.run(
                `UPDATE Evenement
                 SET titre = ?,
                     description = ?,
                     date = ?,
                     lien = ?,
                     image_url = ?,
                     periode_id = ?
                 WHERE id = ?`,
                [titre, description, date, lien, image_url, periode_id, id]
            );

            if (result.changes === 0) {
                throw new Error('Événement non trouvé ou aucune modification effectuée');
            }

            return creerEvent(
                id,
                titre,
                description,
                date,
                lien,
                image_url,
                periode_id
            );
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour de l\'événement');
        }
    },

    // Supprime un événement
    deleteEvent: async (id) => {
        const db = await openDb();
        try {
            const result = await db.run('DELETE FROM Evenement WHERE id = ?', [id]);

            if (result.changes === 0) {
                throw new Error('Événement non trouvé');
            }
            return { message: 'Événement supprimé avec succès' };
        } catch (error) {
            throw new Error('Erreur lors de la suppression de l\'événement');
        }
    }
};
