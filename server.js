import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dashboardRoutes from './routes/dashboard.js';
import metricsRoutes from './routes/metrics.js';
import debugRoutes from './routes/debug.js';
import chatRoutes from './routes/chat.js';
import { startAnomalyDetection } from './services/anomalyEngine.js';
import { startMetricsGenerator } from './services/metricsGenerator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from root (dashboard.html)
app.use(express.static(__dirname));

// API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve dashboard.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Also serve dashboard.html at /dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║          CityPulse AI - Running Successfully!        ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('  🌐  Open in browser: http://localhost:' + PORT);
    console.log('  📊  Dashboard:        http://localhost:' + PORT);
    console.log('  ❤️  Health:          http://localhost:' + PORT + '/health');
    console.log('');
    console.log('  Press Ctrl+C to stop');
    console.log('');
    
    startAnomalyDetection();
    startMetricsGenerator(15000);
});
