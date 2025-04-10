document.addEventListener('DOMContentLoaded', async () => {
    let periods = [];
    let events = [];

    const checkAuthentication = () => {
        const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
        const navbar = document.querySelector('.navbar-links ul');

        const adminLinkExists = document.querySelector('.admin-link');

        if (isLoggedIn && !adminLinkExists) {
            const adminLink = document.createElement('li');
            adminLink.innerHTML = '<a href="admin.html" class="admin-link">Administration</a>';
            adminLink.classList.add('admin-link');
            navbar.appendChild(adminLink);
        }
    };

    const fetchPeriods = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/periodes');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur de chargement des périodes', error);
            return [];
        }
    };

    const fetchEventsByPeriod = async (periodId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/events?periodeId=${periodId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur de chargement des événements', error);
            return [];
        }
    };
    const fetchEventDetails = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/events/${eventId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur de chargement des détails de l\'événement', error);
            return null;
        }
    };

    const initPeriodButtons = () => {
        const periodButtonsContainer = document.getElementById('periods-buttons');
        periodButtonsContainer.innerHTML = '';

        periods.forEach(period => {
            const button = document.createElement('button');
            button.classList.add('period-button');
            button.setAttribute('data-period-id', period.id);
            button.textContent = period.nom;

            button.addEventListener('click', () => {
                document.querySelectorAll('.period-button').forEach(btn => {
                    btn.classList.remove('active');
                });

                button.classList.add('active');

                loadEventsByPeriod(period.id, period.nom);
            });

            periodButtonsContainer.appendChild(button);
        });
    };

    const loadEventsByPeriod = async (periodId, periodName) => {
        const eventsList = document.getElementById('events-list');
        const periodTitle = document.getElementById('selected-period-title');

        periodTitle.textContent = periodName;
        eventsList.innerHTML = '<p>Chargement des événements...</p>';

        try {
            events = await fetchEventsByPeriod(periodId);

            if (!events || events.length === 0) {
                eventsList.innerHTML = '<p>Aucun événement trouvé pour cette période.</p>';
                return;
            }

            eventsList.innerHTML = '';

            events.forEach(event => {
                const li = document.createElement('li');
                li.classList.add('event-item');
                li.setAttribute('data-event-id', event.id);

                const title = document.createElement('h3');
                title.classList.add('event-title');
                title.textContent = event.titre;

                const date = document.createElement('p');
                date.classList.add('event-date');
                date.textContent = event.date || 'Date inconnue';

                li.appendChild(title);
                li.appendChild(date);

                li.addEventListener('click', () => {
                    showEventModal(event.id);
                });

                eventsList.appendChild(li);
            });
        } catch (error) {
            console.error('Erreur lors du chargement des événements', error);
            eventsList.innerHTML = '<p>Erreur lors du chargement des événements.</p>';
        }
    };

    const showEventModal = async (eventId) => {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalImage = document.getElementById('modal-image');
        const modalPeriode = document.getElementById('modal-periode');
        const modalDate = document.getElementById('modal-date');
        const modalLien = document.getElementById('modal-lien');

        modalTitle.textContent = 'Chargement...';
        modalDescription.textContent = '';
        modalImage.src = '';
        modalPeriode.textContent = '';
        modalDate.textContent = '';
        modalLien.href = '#';


        modal.style.display = 'block';

        const eventDetails = await fetchEventDetails(eventId);

        if (eventDetails) {
            modalTitle.textContent = eventDetails.titre;
            modalDescription.textContent = eventDetails.description;
            modalImage.src = eventDetails.image_url || 'img/placeholder.webp';
            modalImage.alt = eventDetails.titre;

            if (eventDetails.periode_nom) {
                modalPeriode.textContent = eventDetails.periode_nom;
            } else {
                const period = periods.find(p => p.id === eventDetails.periode_id);
                modalPeriode.textContent = period ? period.nom : '';
            }

            modalDate.textContent = eventDetails.date || '';

            if (eventDetails.lien) {
                modalLien.href = eventDetails.lien;
                modalLien.parentElement.style.display = 'block';
            } else {
                modalLien.parentElement.style.display = 'none';
            }
        } else {
            modalTitle.textContent = 'Erreur de chargement';
            modalDescription.textContent = 'Impossible de récupérer les détails de cet événement.';
        }
    };

    const initEventHandlers = () => {
        const toggleButton = document.querySelector('.toggle-button');
        const navbarLinks = document.querySelector('.navbar-links');
        const homeLink = document.querySelector('.home-link');
        const closeModal = document.querySelector('.close');
        const modal = document.getElementById('modal');
        const startSiteButton = document.querySelector('.startSite');

        toggleButton.addEventListener('click', () => {
            navbarLinks.classList.toggle('active');
        });

        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            const pageIntro = document.querySelector('.pageIntro');
            const pageContent = document.querySelector('.pageContent');

            pageContent.style.display = 'none';
            pageIntro.style.display = 'flex';
            pageIntro.classList.remove('fade-out');
            pageContent.classList.remove('fade-in', 'visible');

            if (navbarLinks.classList.contains('active')) {
                navbarLinks.classList.remove('active');
            }
        });

        startSiteButton.addEventListener('click', () => {
            const pageIntro = document.querySelector('.pageIntro');
            const pageContent = document.querySelector('.pageContent');

            pageIntro.classList.add("fade-out");

            pageIntro.addEventListener('animationend', () => {
                pageIntro.style.display = "none";
                pageIntro.classList.remove("fade-out");

                pageContent.style.display = "block";
                pageContent.classList.add("fade-in");

                setTimeout(() => {
                    pageContent.classList.add("visible");
                }, 50);
            }, { once: true });
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    };

    const init = async () => {
        checkAuthentication();

        periods = await fetchPeriods();

        initPeriodButtons();

        initEventHandlers();
    };

    init();
});