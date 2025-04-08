import { authService } from '../services/authService.js';
import { userRepository } from '../repositories/userRepository.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Accès non autorisé. Token manquant.'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = authService.verifyToken(token);

        const user = await userRepository.getUserById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: 'Utilisateur non trouvé'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Accès non autorisé',
            error: error.message
        });
    }
};

export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: 'Accès interdit. Droits administrateur requis.'
        });
    }
};