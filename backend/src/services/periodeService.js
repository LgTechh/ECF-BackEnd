import { periodeRepository} from "../repositories/periodeRepository.js";
import {eventRepository} from "../repositories/eventRepository.js";

export const periodeService = {
    getAllPeriodes: async (themeId) => {
        try {
            if (themeId) {
                return await periodeRepository.getPeriodeByTheme(themeId);
            }
            return await periodeRepository.getAllPeriodes();
        } catch (error) {
            throw new Error('Erreur lors de la récupération des périodes');
        }
    }
};

