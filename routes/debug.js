import express from 'express';
import { supabase } from '../services/supabaseClient.js';
import { generateAIInsight } from '../services/llmService.js';

const router = express.Router();

router.post('/trigger', async (req, res) => {
    try {
        const zoneId = req.body?.zoneId || null;
        
        let targetZoneId = zoneId;
        if (!targetZoneId) {
            const { data: zone, error: zoneError } = await supabase
                .from('zones')
                .select('id, name')
                .limit(1)
                .single();
            
            if (zoneError || !zone) {
                return res.status(400).json({ error: 'No zones found in database' });
            }
            targetZoneId = zone.id;
        }
        
        const { data: spike, error: spikeError } = await supabase
            .from('metrics_log')
            .insert({
                zone_id: targetZoneId,
                pm25_level: 180,
                traffic_speed: 8
            })
            .select()
            .single();
        
        if (spikeError) throw spikeError;
        
        const { data: zone } = await supabase
            .from('zones')
            .select('name')
            .eq('id', targetZoneId)
            .single();
        
        const insight = await generateAIInsight(
            zone?.name || 'Unknown',
            spike,
            []
        );
        
        const { data: savedInsight, error: insightError } = await supabase
            .from('ai_insights')
            .insert({
                zone_id: targetZoneId,
                severity: insight.severity,
                summary: insight.summary,
                action_plan: insight.action_plan
            })
            .select()
            .single();
        
        if (insightError) throw insightError;
        
        res.json({
            success: true,
            message: 'Anomaly triggered!',
            metric: spike,
            insight: savedInsight
        });
    } catch (error) {
        console.error('Trigger error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
