// Fonction pour vérifier l'authentification
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
    const token = localStorage.getItem('token');

    if (!isLoggedIn || !token) {
        window.location.href = "login.html?message=Veuillez vous connecter pour accéder à l'administration";
        return false;
    }
    return token;
}

let periodes = [];
let evenements = [];
let token = '';

// Fonctions API
async function fetchPeriodes() {
    try {
        const response = await fetch('http://localhost:3001/api/periodes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des périodes', error);
        return [];
    }
}

async function fetchEvenements() {
    try {
        const response = await fetch('http://localhost:3001/api/events', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des événements', error);
        return [];
    }
}

function openTab(tabName) {
    console.log(`Ouverture de l'onglet: ${tabName}`);

    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }

    // Désactiver tous les boutons d'onglets
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    document.getElementById(tabName).style.display = 'block';

    // Activer le bouton correspondant
    const activeButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function showPeriodeForm() {
    document.getElementById('periode-form').style.display = 'block';
    document.getElementById('periode-id').value = '';
    document.getElementById('periode-nom').value = '';
}

function hidePeriodeForm() {
    document.getElementById('periode-form').style.display = 'none';
}

function showEvenementForm() {
    document.getElementById('evenement-form').style.display = 'block';
    document.getElementById('evenement-id').value = '';
    document.getElementById('evenement-titre').value = '';
    document.getElementById('evenement-description').value = '';
    document.getElementById('evenement-date').value = '';
    document.getElementById('evenement-lien').value = '';
    document.getElementById('evenement-image').value = '';
    document.getElementById('evenement-periode-nom').value = '';
}

function hideEvenementForm() {
    document.getElementById('evenement-form').style.display = 'none';
}

function editPeriode(id) {
    const periode = periodes.find(p => p.id === id);
    if (periode) {
        document.getElementById('periode-id').value = periode.id;
        document.getElementById('periode-nom').value = periode.nom;
        document.getElementById('periode-form').style.display = 'block';
    }
}

async function deletePeriode(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette période ?')) {
        try {
            const response = await fetch(`http://localhost:3001/api/periodes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Période supprimée avec succès');
                // Rafraîchir les données
                periodes = await fetchPeriodes();
                renderPeriodesTable();
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.message}`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression', error);
            alert('Une erreur est survenue lors de la suppression');
        }
    }
}

function editEvenement(id) {
    const evenement = evenements.find(e => e.id === id);
    if (evenement) {
        document.getElementById('evenement-id').value = evenement.id;
        document.getElementById('evenement-titre').value = evenement.titre;
        document.getElementById('evenement-description').value = evenement.description || '';
        document.getElementById('evenement-date').value = evenement.date || '';
        document.getElementById('evenement-lien').value = evenement.lien || '';
        document.getElementById('evenement-image').value = evenement.image_url || '';

        // Utiliser le nom de période au lieu de l'ID
        const periode = periodes.find(p => p.id === evenement.periode_id);
        document.getElementById('evenement-periode-nom').value = periode ? periode.nom : (evenement.periode_nom || '');

        document.getElementById('evenement-form').style.display = 'block';
    }
}

async function deleteEvenement(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
        try {
            const response = await fetch(`http://localhost:3001/api/events/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Événement supprimé avec succès');
                // Rafraîchir les données
                evenements = await fetchEvenements();
                renderEvenementsTable();
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.message}`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression', error);
            alert('Une erreur est survenue lors de la suppression');
        }
    }
}

async function savePeriode() {
    console.log("Sauvegarde période déclenchée");

    const id = document.getElementById('periode-id').value;
    const nom = document.getElementById('periode-nom').value;

    if (!nom) {
        alert("Le nom de la période est requis!");
        return;
    }

    const periodeData = { nom };

    console.log("Données période à envoyer:", periodeData);

    try {
        let response;
        if (id) {
            response = await fetch(`http://localhost:3001/api/periodes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(periodeData)
            });
        } else {
            response = await fetch('http://localhost:3001/api/periodes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(periodeData)
            });
        }

        if (response.ok) {
            alert(id ? 'Période mise à jour avec succès' : 'Période créée avec succès');
            hidePeriodeForm();
            periodes = await fetchPeriodes();
            renderPeriodesTable();
        } else {
            const error = await response.json();
            alert(`Erreur: ${error.message}`);
        }
    } catch (error) {
        console.error("Erreur lors de l'enregistrement", error);
        alert("Une erreur est survenue lors de l'enregistrement");
    }
}

async function getCSRFToken() {
    const response = await fetch('http://localhost:3001/api/csrf-token', {
        credentials: 'include' // important si tu utilises des cookies
    });
    const data = await response.json();
    return data.csrfToken;
}
async function saveEvenement() {
    console.log("Sauvegarde événement déclenchée");
    const csrfToken = await getCSRFToken();

    const id = document.getElementById('evenement-id').value;
    const titre = document.getElementById('evenement-titre').value;
    const description = document.getElementById('evenement-description').value;
    const date = document.getElementById('evenement-date').value;
    const lien = document.getElementById('evenement-lien').value;
    const image_url = document.getElementById('evenement-image').value;
    const periode_nom = document.getElementById('evenement-periode-nom').value;

    if (!titre) {
        alert("Le titre de l'événement est requis!");
        return;
    }

    // Recherche d'une période existante par son nom
    let periode_id = null;
    if (periode_nom && Array.isArray(periodes)) {
        const periodeExistante = periodes.find(p => p.nom && p.nom.toLowerCase() === periode_nom.toLowerCase());
        if (periodeExistante) {
            periode_id = periodeExistante.id;
        }
    }

    const evenementData = {
        titre, description, date, lien, image_url, periode_nom, periode_id
    };

    console.log("Données événement à envoyer:", evenementData);

    try {
        let response;
        if (id) {
            response = await fetch(`http://localhost:3001/api/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify(evenementData)
            });
        } else {
            response = await fetch('http://localhost:3001/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify(evenementData)
            });
        }

        if (response.ok) {
            alert(id ? 'Événement mis à jour avec succès' : 'Événement créé avec succès');
            hideEvenementForm();
            evenements = await fetchEvenements();
            renderEvenementsTable();
        } else {
            const error = await response.json();
            alert(`Erreur: ${error.message}`);
        }
    } catch (error) {
        console.error("Erreur lors de l'enregistrement", error);
        alert("Une erreur est survenue lors de l'enregistrement");
    }
}

// Fonctions de rendu
function renderPeriodesTable() {
    const tbody = document.querySelector('#periodes-table tbody');
    tbody.innerHTML = '';

    if (Array.isArray(periodes)) {
        periodes.forEach(periode => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${periode.id}</td>
                <td>${periode.nom}</td>
                <td>N/A</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editPeriode(${periode.id})">Modifier</button>
                    <button class="btn-delete" onclick="deletePeriode(${periode.id})">Supprimer</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function renderEvenementsTable() {
    console.log('Rendu du tableau des événements avec', evenements.length, 'événements');
    const tbody = document.querySelector('#evenements-table tbody');
    tbody.innerHTML = '';

    if (Array.isArray(evenements)) {
        evenements.forEach(evenement => {
            const periode = Array.isArray(periodes) ?
                periodes.find(p => p.id === evenement.periode_id) : null;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${evenement.id}</td>
                <td>${evenement.titre}</td>
                <td>${evenement.date || 'N/A'}</td>
                <td>${periode ? periode.nom : (evenement.periode_nom || 'N/A')}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editEvenement(${evenement.id})">Modifier</button>
                    <button class="btn-delete" onclick="deleteEvenement(${evenement.id})">Supprimer</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function setupLogout() {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
            window.location.href = 'index.html';
        });
    }
}

function initTabButtons() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        const tabId = button.getAttribute('data-tab');
        button.addEventListener('click', () => {
            openTab(tabId);
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    token = checkAuth();
    if (!token) return;

    window.openTab = openTab;
    window.showPeriodeForm = showPeriodeForm;
    window.hidePeriodeForm = hidePeriodeForm;
    window.showEvenementForm = showEvenementForm;
    window.hideEvenementForm = hideEvenementForm;
    window.editPeriode = editPeriode;
    window.deletePeriode = deletePeriode;
    window.editEvenement = editEvenement;
    window.deleteEvenement = deleteEvenement;
    window.savePeriode = savePeriode;
    window.saveEvenement = saveEvenement;

    try {
        periodes = await fetchPeriodes();
        console.log("Périodes chargées:", periodes);
        evenements = await fetchEvenements();
        console.log("Événements chargés:", evenements);
    } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        alert("Erreur lors du chargement des données. Veuillez rafraîchir la page.");
    }

    setupLogout();
    initTabButtons();
    renderPeriodesTable();
    renderEvenementsTable();

    openTab('periodes');
});