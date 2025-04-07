export const creerEvent = (id, titre, description, date, lien, image_url, periode_id,periode_nom) => ({
    id,
    titre,
    description,
    date,
    lien,
    image_url,
    periode_id,
    periode_nom
});

export const validerEvent= (event) => {
    const erreurs = [];

    // Validation du titre
    if (!event.titre || event.titre.trim() === '') {
        erreurs.push("Le titre est requis.");
    } else {
        console.log("La vérification du titre a réussi ✅");
    }

    // Validation de la date
    console.log(event.date)
    if (!event.date || isNaN(new Date(event.date).getTime())) {
        erreurs.push("La date de l'événement doit être une date valide.");
    } else {
        console.log("La vérification de la date a réussi ✅");
    }

    // Validation de l'URL du lien (si spécifiée)
    if (event.lien && !/^https?:\/\/[^\s]+$/.test(event.lien)) {
        erreurs.push("Le lien doit être une URL valide.");
    } else {
        console.log("La vérification du lien a réussi ✅");
    }

    // Validation de la période
    if (!event.periode_id || isNaN(event.periode_id)) {
        erreurs.push("La période associée est requise.");
    } else {
        console.log("La vérification de la période a réussi ✅");
    }

    return {
        estValide: erreurs.length === 0,
        erreurs
    };
};

