import sqlite3 from 'sqlite3';
import path from 'path';
import { copyFile } from 'fs/promises';

/**
 * Ouvre la base de données de test.
 * @returns {sqlite3.Database} Instance de la base de données de test.
 */
export const openDb = () => {
    const dbPath = path.resolve('./data/database_test.db');
    const db = new sqlite3.Database(dbPath);
    return db;
};

/**
 * Copie la base de données initiale dans la base de données de test.
 */
const copyDatabase = async () => {
    const sourceDbPath = path.resolve('./data/database.db');
    const testDbPath = path.resolve('./data/database_test.db');
    await copyFile(sourceDbPath, testDbPath);  // Copie du fichier
};

/**
 * Réinitialise la base de données de test pour revenir à son état initial.
 */
export const resetDbTest = async () => {
    try {
        await copyDatabase();  // Copier la base de données
    } catch (error) {
        console.error("Erreur lors de la réinitialisation de la base de données de test:", error);
    }
};