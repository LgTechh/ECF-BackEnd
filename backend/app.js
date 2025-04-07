import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config.js';
import eventRoutes from './src/routes/eventRoutes.js';
import periodeRoutes from './src/routes/periodeRoutes.js';

// Recrée __dirname en ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.API_PORT;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour parser les requêtes URL-encoded
app.use(express.urlencoded({ extended: true }));

// Configuration CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Routes API
console.log("Enregistrement des routes : /api/events");
app.use('/api/events', eventRoutes);

app.use('/api/periodes', periodeRoutes);

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Gestion des routes non trouvées pour l'API
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Route pour toutes les autres demandes - renvoie au frontend (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});