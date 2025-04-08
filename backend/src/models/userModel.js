export const creerUtilisateur = (id, username, email, password, role = 'user') => ({
    id,
    username,
    email,
    password,
    role
});

export const validerUtilisateur = (utilisateur) => {
    const erreurs = [];

    if (!utilisateur.username || utilisateur.username.trim() === '') {
        erreurs.push("Le nom d'utilisateur est requis.");
    }

    if (!utilisateur.email || utilisateur.email.trim() === '') {
        erreurs.push("L'email est requis.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(utilisateur.email)) {
        erreurs.push("L'email doit être une adresse valide.");
    }

    if (!utilisateur.password || utilisateur.password.trim() === '') {
        erreurs.push("Le mot de passe est requis.");
    } else if (utilisateur.password.length < 6) {
        erreurs.push("Le mot de passe doit contenir au moins 6 caractères.");
    }

    return {
        estValide: erreurs.length === 0,
        erreurs
    };
};