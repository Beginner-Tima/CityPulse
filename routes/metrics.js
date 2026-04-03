import express from 'express';
import { supabase } from '../services/supabaseClient.js';

const router = express.Router();

router.get('/history', async (req, res) => {
    try {
        const { data: metrics, error } = await supabase
            .from('metrics_log')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(50);
        
        if (error) throw error;
        
        res.json(metrics || []);
    } catch (error) {
        console.error('Metrics history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/history/:zoneId', async (req, res) => {
    try {
        const { zoneId } = req.params;
        
        const { data: metrics, error } = await supabase
            .from('metrics_log')
            .select('*')
            .eq('zone_id', zoneId)
            .order('created_at', { ascending: true })
            .limit(50);
        
        if (error) throw error;
        
        res.json(metrics || []);
    } catch (error) {
        console.error('Metrics history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/live', async (req, res) => {
    try {
        const { data: zones } = await supabase.from('zones').select('id, name');
        
        const liveData = await Promise.all(zones.map(async (zone) => {
            const { data: latest } = await supabase
                .from('metrics_log')
                .select('*')
                .eq('zone_id', zone.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            return { ...zone, ...latest };
        }));
        
        res.json(liveData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
