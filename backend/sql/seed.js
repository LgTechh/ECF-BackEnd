import sqlite3 from 'sqlite3';
import fs from 'fs/promises';

(async () => {
    try {
        const db = new sqlite3.Database('data/database.db');

        const sql = await fs.readFile('sql/init.sql', 'utf8');

        db.exec(sql, (err) => {
            if (err) {
                console.error("Erreur lors de l'exécution du SQL :", err);
            } else {
                console.log("Le fichier SQL a été exécuté avec succès !");
            }

            db.close();
        });
    } catch (error) {
        console.error("Erreur lors de la lecture du fichier SQL :", error);
    }
})();
