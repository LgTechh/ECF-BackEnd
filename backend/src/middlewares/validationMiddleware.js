import { body, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const registerValidationRules = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage("Le nom d'utilisateur doit contenir au moins 3 caractères"),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Veuillez fournir un email valide'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

export const loginValidationRules = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Veuillez fournir un email valide'),
    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis')
];

export const eventValidationRules = [
    body('titre')
        .trim()
        .notEmpty()
        .escape()
        .withMessage('Le titre est requis'),
    body('description')
        .trim()
        .escape(),
    body('date')
        .isISO8601()
        .toDate()
        .withMessage('La date doit être valide'),
    body('lien')
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage('Le lien doit être une URL valide'),
    body('image_url')
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage("L'URL de l'image doit être valide"),
    body('periode_id')
        .isInt()
        .withMessage('La période doit être un ID valide')
];

export const idValidationRules = [
    param('id')
        .isInt()
        .withMessage("L'ID doit être un nombre entier")
];