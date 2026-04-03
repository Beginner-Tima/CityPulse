import { supabase } from './supabaseClient.js';

const ZONE_IDS = [
    '26605aa9-d1b4-4fd9-b8e1-a7a9b7662f51', // Alatau District
    'a956b3f8-425b-4761-bc31-cac05af6548d', // Bostandyk District
    '937f56d2-164c-4001-9c88-0bdd99cdf1c6'  // Medeu District
];

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

export async function generateMockMetrics() {
    console.log('📊 Generating mock metrics...');
    
    const metrics = [];
    const now = new Date();
    
    for (const zoneId of ZONE_IDS) {
        const pm25 = Math.round(randomInRange(15, 45));
        const speed = Math.round(randomInRange(30, 65));
        
        metrics.push({
            zone_id: zoneId,
            created_at: now.toISOString(),
            pm25_level: pm25,
            traffic_speed: speed
        });
    }
    
    const { data, error } = await supabase
        .from('metrics_log')
        .insert(metrics)
        .select();
    
    if (error) {
        console.error('Error generating metrics:', error);
    } else {
        console.log(`✅ Generated ${data.length} new metrics`);
    }
    
    return data;
}

export function startMetricsGenerator(intervalMs = 20000) {
    console.log(`🚀 Starting metrics generator (every ${intervalMs/1000}s)...`);
    
    // Generate immediately
    generateMockMetrics();
    
    // Then every interval
    setInterval(generateMockMetrics, intervalMs);
}
