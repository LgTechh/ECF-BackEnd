document.addEventListener('DOMContentLoaded', async () => {
    const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
    const token = localStorage.getItem('token');

    if (!isLoggedIn || !token) {
        window.location.href = "login.html?message=Veuillez vous connecter pour accéder à l'administration";
        return;
    }

    let periodes = [];
    let themes = [];
    let evenements = [];

    const fetchPeriodes = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/periodes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des périodes', error);
            return [];
        }
    };

    const fetchThemes = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/themes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des thèmes', error);
            return [];
        }
    };

    const fetchEvenements = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/events', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des événements', error);
            return [];
        }
    };

    const openTab = (tabName) => {
        console.log(`Ouverture de l'onglet: ${tabName}`);
        const tabContents = document.getElementsByClassName('tab-content');
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = 'none';
        }

        const tabButtons = document.getElementsByClassName('tab-button');
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove('active');
        }

        document.getElementById(tabName).style.display = 'block';

        // Trouver le bouton correspondant et l'activer
        const activeButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    };

    window.openTab = openTab;

    window.showPeriodeForm = () => {
        document.getElementById('periode-form').style.display = 'block';
        document.getElementById('periode-id').value = '';
        document.getElementById('periode-nom').value = '';
        document.getElementById('periode-theme').selectedIndex = 0;
    };

    window.hidePeriodeForm = () => {
        document.getElementById('periode-form').style.display = 'none';
    };

    window.showEvenementForm = () => {
        document.getElementById('evenement-form').style.display = 'block';
        document.getElementById('evenement-id').value = '';
        document.getElementById('evenement-titre').value = '';
        document.getElementById('evenement-description').value = '';
        document.getElementById('evenement-date').value = '';
        document.getElementById('evenement-lien').value = '';
        document.getElementById('evenement-image').value = '';
        document.getElementById('evenement-periode').selectedIndex = 0;
    };

    window.hideEvenementForm = () => {
        document.getElementById('evenement-form').style.display = 'none';
    };

    window.editPeriode = (id) => {
        const periode = periodes.find(p => p.id === id);
        if (periode) {
            document.getElementById('periode-id').value = periode.id;
            document.getElementById('periode-nom').value = periode.nom;
            document.getElementById('periode-theme').value = periode.theme_id;
            document.getElementById('periode-form').style.display = 'block';
        }
    };

    window.deletePeriode = async (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette période ?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/periodes/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
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
    };

    window.editEvenement = (id) => {
        const evenement = evenements.find(e => e.id === id);
        if (evenement) {
            document.getElementById('evenement-id').value = evenement.id;
            document.getElementById('evenement-titre').value = evenement.titre;
            document.getElementById('evenement-description').value = evenement.description || '';
            document.getElementById('evenement-date').value = evenement.date || '';
            document.getElementById('evenement-lien').value = evenement.lien || '';
            document.getElementById('evenement-image').value = evenement.image_url || '';
            document.getElementById('evenement-periode').value = evenement.periode_id;
            document.getElementById('evenement-form').style.display = 'block';
        }
    };

    window.deleteEvenement = async (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/events/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
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
    };

    const renderPeriodesTable = () => {
        const tbody = document.querySelector('#periodes-table tbody');
        tbody.innerHTML = '';

        periodes.forEach(periode => {
            const theme = themes.find(t => t.id === periode.theme_id);
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${periode.id}</td>
                <td>${periode.nom}</td>
                <td>${theme ? theme.nom : 'N/A'}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editPeriode(${periode.id})">Modifier</button>
                    <button class="btn-delete" onclick="deletePeriode(${periode.id})">Supprimer</button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    };

    const renderEvenementsTable = () => {
        console.log('Rendu du tableau des événements avec', evenements.length, 'événements');
        const tbody = document.querySelector('#evenements-table tbody');
        tbody.innerHTML = '';

        evenements.forEach(evenement => {
            const periode = periodes.find(p => p.id === evenement.periode_id);
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${evenement.id}</td>
                <td>${evenement.titre}</td>
                <td>${evenement.date || 'N/A'}</td>
                <td>${periode ? periode.nom : 'N/A'}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editEvenement(${evenement.id})">Modifier</button>
                    <button class="btn-delete" onclick="deleteEvenement(${evenement.id})">Supprimer</button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    };

    const populateSelects = () => {
        const themeSelect = document.getElementById('periode-theme');
        themeSelect.innerHTML = '<option value="">Sélectionnez un thème</option>';

        themes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.id;
            option.textContent = theme.nom;
            themeSelect.appendChild(option);
        });

        const periodeSelect = document.getElementById('evenement-periode');
        periodeSelect.innerHTML = '<option value="">Sélectionnez une période</option>';

        periodes.forEach(periode => {
            const option = document.createElement('option');
            option.value = periode.id;
            option.textContent = periode.nom;
            periodeSelect.appendChild(option);
        });
    };

    const initForms = () => {
        const formPeriode = document.getElementById('form-periode');
        formPeriode.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('periode-id').value;
            const nom = document.getElementById('periode-nom').value;
            const theme_id = document.getElementById('periode-theme').value;

            const periodeData = {
                nom,
                theme_id: parseInt(theme_id)
            };

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
                    populateSelects();
                } else {
                    const error = await response.json();
                    alert(`Erreur: ${error.message}`);
                }
            } catch (error) {
                console.error("Erreur lors de l'enregistrement", error);
                alert("Une erreur est survenue lors de l'enregistrement");
            }
        });

        const formEvenement = document.getElementById('form-evenement');
        formEvenement.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('evenement-id').value;
            const titre = document.getElementById('evenement-titre').value;
            const description = document.getElementById('evenement-description').value;
            const date = document.getElementById('evenement-date').value;
            const lien = document.getElementById('evenement-lien').value;
            const image_url = document.getElementById('evenement-image').value;
            const periode_id = document.getElementById('evenement-periode').value;

            const evenementData = {
                titre,
                description,
                date,
                lien,
                image_url,
                periode_id: parseInt(periode_id)
            };

            try {
                let response;

                if (id) {
                    response = await fetch(`http://localhost:3001/api/events/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(evenementData)
                    });
                } else {
                    response = await fetch('http://localhost:3001/api/events', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
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
        });
    };

    document.getElementById('logout-link').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        window.location.href = 'index.html';
    });

    const initTabButtons = () => {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            const tabId = button.getAttribute('data-tab');
            button.addEventListener('click', () => {
                openTab(tabId);
            });
        });
    };

    const init = async () => {
        themes = await fetchThemes();
        periodes = await fetchPeriodes();
        evenements = await fetchEvenements();

        console.log('Données récupérées:', { themes, periodes, evenements });

        initTabButtons();

        renderPeriodesTable();
        renderEvenementsTable();

        populateSelects();

        initForms();

        openTab('periodes');
    };

    init();
});