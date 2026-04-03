import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboard.js';
import metricsRoutes from './routes/metrics.js';
import debugRoutes from './routes/debug.js';
import { startAnomalyDetection } from './services/anomalyEngine.js';
import { startMetricsGenerator } from './services/metricsGenerator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/debug', debugRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 CityPulse Backend running on port ${PORT}`);
    startAnomalyDetection();
    startMetricsGenerator(15000); // Generate new metrics every 15 seconds
});
