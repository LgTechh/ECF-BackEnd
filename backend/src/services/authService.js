import { userRepository } from '../repositories/userRepository.js';
import { validerUtilisateur } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config.js';

export const authService = {
    register: async (userData) => {
        const { estValide, erreurs } = validerUtilisateur(userData);

        if (!estValide) {
            throw new Error(`Erreur de validation: ${erreurs.join(', ')}`);
        }

        try {
            return await userRepository.createUser(userData);
        } catch (error) {
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            const user = await userRepository.getUserByEmail(email);

            if (!user) {
                throw new Error('Identifiants invalides');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error('Identifiants invalides');
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    role: user.role
                },
                config.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            };
        } catch (error) {
            throw error;
        }
    },

    verifyToken: (token) => {
        try {
            return jwt.verify(token, config.JWT_SECRET);
        } catch (error) {
            throw new Error('Token invalide');
        }
    }
};