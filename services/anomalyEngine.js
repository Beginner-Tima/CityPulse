import { supabase } from './supabaseClient.js';
import { generateAIInsight } from './llmService.js';

const ANOMALY_INTERVAL = 60000;

export async function checkAnomalies() {
    console.log('🔍 Checking for anomalies...');
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: recentMetrics, error } = await supabase
        .from('metrics_log')
        .select('id, zone_id, created_at, pm25_level, traffic_speed')
        .gte('created_at', fiveMinutesAgo)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching metrics:', error);
        return;
    }

    const zones = [...new Set(recentMetrics.map(m => m.zone_id))];
    
    for (const zoneId of zones) {
        const zoneMetrics = recentMetrics.filter(m => m.zone_id === zoneId);
        const current = zoneMetrics[0];
        
        if (current && current.pm25_level > 100 && current.traffic_speed < 15) {
            console.log(`🚨 ANOMALY DETECTED in zone ${zoneId}!`);
            
            const { data: zone } = await supabase
                .from('zones')
                .select('name')
                .eq('id', zoneId)
                .single();
            
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const { data: history } = await supabase
                .from('metrics_log')
                .select('*')
                .eq('zone_id', zoneId)
                .gte('created_at', oneHourAgo)
                .order('created_at', { ascending: true });
            
            const insight = await generateAIInsight(
                zone?.name || 'Unknown Zone',
                current,
                history || []
            );
            
            const { error: insertError } = await supabase
                .from('ai_insights')
                .insert({
                    zone_id: zoneId,
                    severity: insight.severity,
                    summary: insight.summary,
                    action_plan: insight.action_plan
                });
            
            if (insertError) {
                console.error('Error saving insight:', insertError);
            } else {
                console.log(`✅ Insight saved for zone ${zoneId}`);
            }
        }
    }
}

export function startAnomalyDetection() {
    console.log('🚀 Starting anomaly detection engine...');
    setInterval(checkAnomalies, ANOMALY_INTERVAL);
    checkAnomalies();
}
