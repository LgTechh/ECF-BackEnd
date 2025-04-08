import { authService } from '../services/authService.js';
export const register = async (req, res) => {
    try {
        const userData = req.body;
        const user = await authService.register(userData);
        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user
        });
    } catch (error) {
        res.status(400).json({
            message: "Erreur lors de la création de l'utilisateur",
            error: error.message
        });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email et mot de passe requis'
            });
        }

        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({
            message: "Échec de l'authentification",
            error: error.message
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du profil',
            error: error.message
        });
    }
};