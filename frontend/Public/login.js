document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    const toggleButton = document.querySelector('.toggle-button');
    const navbarLinks = document.querySelector('.navbar-links');

    toggleButton.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        loginMessage.textContent = '';
        loginMessage.className = 'form-message';
        loginMessage.style.display = 'block';

        console.log('Tentative de connexion avec:', { email, password });
        loginMessage.textContent = 'Connexion en cours...';

        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log('Réponse du serveur:', data);

            if (response.ok) {
                loginMessage.textContent = 'Connexion réussie ! Redirection en cours...';
                loginMessage.classList.add('message-success');

                localStorage.setItem('token', data.token);
                localStorage.setItem('isAuthenticated', 'true');

                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);
            } else {
                // Erreur de connexion
                loginMessage.textContent = data.message || 'Email ou mot de passe incorrect.';
                loginMessage.classList.add('message-error');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion', error);
            loginMessage.textContent = 'Erreur de connexion au serveur. Veuillez réessayer.';
            loginMessage.classList.add('message-error');
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');

    if (message) {
        loginMessage.textContent = message;
        loginMessage.classList.add('message-info');
        loginMessage.style.display = 'block';
    }
});