import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import config from '../config.js';
import eventRoutes from './src/routes/eventRoutes.js';
import periodeRoutes from './src/routes/periodeRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import {csrfProtection} from "./src/middlewares/csrfMiddleware.js";
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.API_PORT;

// Configuration de Helmet pour les headers de sécurité
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
        },
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

console.log("Enregistrement des routes : /api/events");

app.use('/api/events', eventRoutes);
app.use('/api/periodes', periodeRoutes);
app.use('/api/auth', authRoutes);

// Endpoint pour fournir un token CSRF aux clients
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.use(express.static(path.join(__dirname, '../frontend/public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        }
    }
}));

app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});