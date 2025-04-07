export const creerPeriode = (id, nom, theme_id, theme_nom, theme_annee) => ({
    id,
    nom,
    theme_id,
    theme_nom,
    theme_annee
});

export const validerPeriode = (periode) => {
    const erreurs = [];

    if (!periode.nom || periode.nom.trim() === '') {
        erreurs.push("Le nom de la période est requis.");
    } else {
        console.log("La vérification du nom a réussi ✅");
    }

    if (!periode.theme_id || isNaN(periode.theme_id)) {
        erreurs.push("Le thème associé est requis et doit être un nombre.");
    } else {
        console.log("La vérification du thème a réussi ✅");
    }

    if (periode.theme_nom && periode.theme_nom.trim() === '') {
        erreurs.push("Le nom du thème ne peut pas être vide.");
    }

    if (periode.theme_annee && isNaN(periode.theme_annee)) {
        erreurs.push("L'année du thème doit être un nombre.");
    }

    return {
        estValide: erreurs.length === 0,
        erreurs
    };
};
