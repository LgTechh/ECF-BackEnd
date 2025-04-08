import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config.js';
import eventRoutes from './src/routes/eventRoutes.js';
import periodeRoutes from './src/routes/periodeRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.API_PORT;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

console.log("Enregistrement des routes : /api/events");
app.use('/api/events', eventRoutes);

app.use('/api/periodes', periodeRoutes);

app.use('/api/auth', authRoutes);

app.use(express.static(path.join(__dirname, '../frontend/public')));

app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});