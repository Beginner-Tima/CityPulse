import express from 'express';
import { supabase } from '../services/supabaseClient.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
    try {
        const { data: zones } = await supabase
            .from('zones')
            .select('id, name, description');
        
        const latestMetrics = [];
        
        for (const zone of zones) {
            const { data: latest } = await supabase
                .from('metrics_log')
                .select('*')
                .eq('zone_id', zone.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            if (latest) {
                latestMetrics.push({
                    ...zone,
                    ...latest
                });
            }
        }
        
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { count: activeAlerts } = await supabase
            .from('ai_insights')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', oneHourAgo);
        
        const avgPM25 = latestMetrics.reduce((sum, m) => sum + m.pm25_level, 0) / latestMetrics.length || 0;
        const avgSpeed = latestMetrics.reduce((sum, m) => sum + m.traffic_speed, 0) / latestMetrics.length || 0;
        const healthStatus = avgPM25 < 50 && avgSpeed > 30 ? 'Healthy' : 'Warning';
        
        res.json({
            zones: latestMetrics,
            kpis: {
                avgAirQuality: Math.round(avgPM25),
                trafficFlow: Math.round(avgSpeed),
                activeAlerts: activeAlerts || 0,
                systemHealth: healthStatus
            }
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/insights/active', async (req, res) => {
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        
        const { data: insights, error } = await supabase
            .from('ai_insights')
            .select('*, zones(name)')
            .gte('created_at', oneHourAgo)
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (error) throw error;
        
        res.json(insights || []);
    } catch (error) {
        console.error('Insights error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
