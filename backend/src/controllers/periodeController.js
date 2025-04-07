import { periodeService } from "../services/periodeService.js";

export const getAllPeriodes = async (req, res) => {
    const { themeId } = req.query;
    try {
        const periodes = await periodeService.getAllPeriodes(themeId);
        res.status(200).json(periodes);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des événements',
            error: error.message
        });
    }
};