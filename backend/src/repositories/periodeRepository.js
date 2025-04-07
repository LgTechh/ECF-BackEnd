import { openDb } from '../../config/db.js';
import {creerPeriode} from "../models/periodeModel.js";

export const periodeRepository = {
    getAllPeriodes: async () => {
        const db = await openDb();
        try {
            const periodesData = await db.all(`SELECT *
                                               FROM Periode`);

            return periodesData.map(periode => creerPeriode(
                periode.id,
                periode.nom,
                periode.theme_id
            ));

        } catch (error) {
            throw new Error('Erreur lors de la récupération des événements');
        }
    },

    getPeriodeByTheme: async (themeId) => {
        const db = await openDb();
        try {
            const numericThemeId = Number(themeId);
            const periodesData = await db.all(`SELECT
            Periode.id,
            Periode.nom,
            Periode.theme_id,
            Theme.nom AS theme_nom,
            Theme.annee AS theme_annee 
            FROM
            Theme
            INNER JOIN
            Periode ON Theme.id = Periode.theme_id
            WHERE
            Theme.id = ?`, [numericThemeId]);

            return periodesData.map(periode => creerPeriode(
                periode.id,
                periode.nom,
                periode.theme_id,
                periode.theme_nom,
                periode.theme_annee
            ));

        } catch (error) {
            throw new Error('Erreur lors de la récupération des événements par période');
        }
    },
}