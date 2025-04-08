import { openDb } from '../../config/db.js';
import { creerUtilisateur } from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const userRepository = {
    createUser: async (userData) => {
        const db = await openDb();
        try {
            const { username, email, password, role = 'user' } = userData;

            const existingUser = await db.get('SELECT * FROM Utilisateur WHERE email = ?', [email]);
            if (existingUser) {
                throw new Error('Un utilisateur avec cet email existe déjà');
            }

            // Hachage du mot de passe
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const result = await db.run(
                `INSERT INTO Utilisateur (username, email, password, role)
                 VALUES (?, ?, ?, ?)`,
                [username, email, hashedPassword, role]
            );

            return creerUtilisateur(
                result.lastID,
                username,
                email,
                null, // Ne pas retourner le mot de passe
                role
            );
        } catch (error) {
            throw error;
        }
    },

    getUserByEmail: async (email) => {
        const db = await openDb();
        try {
            const userData = await db.get('SELECT * FROM Utilisateur WHERE email = ?', [email]);

            if (!userData) {
                return null;
            }

            return creerUtilisateur(
                userData.id,
                userData.username,
                userData.email,
                userData.password,
                userData.role
            );
        } catch (error) {
            throw error;
        }
    },

    getUserById: async (id) => {
        const db = await openDb();
        try {
            const userData = await db.get('SELECT * FROM Utilisateur WHERE id = ?', [id]);

            if (!userData) {
                return null;
            }

            return creerUtilisateur(
                userData.id,
                userData.username,
                userData.email,
                null,
                userData.role
            );
        } catch (error) {
            throw error;
        }
    }
};