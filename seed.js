import { supabase } from './services/supabaseClient.js';

async function seedMetrics() {
  try {
    const { data: zones, error: zonesError } = await supabase
      .from('zones')
      .select('id');

    if (zonesError) {
      throw new Error(`Failed to fetch zones: ${zonesError.message}`);
    }

    if (!zones || zones.length === 0) {
      console.log('No zones found in database');
      return;
    }

    console.log(`Found ${zones.length} zones`);

    const now = new Date();
    const metrics = [];

    for (const zone of zones) {
      for (let i = 0; i < 30; i++) {
        const timestamp = new Date(now.getTime() - i * 10 * 60 * 1000);
        metrics.push({
          zone_id: zone.id,
          created_at: timestamp.toISOString(),
          pm25_level: Math.floor(Math.random() * 21) + 15,
          traffic_speed: Math.floor(Math.random() * 26) + 35
        });
      }
    }

    const { data, error } = await supabase
      .from('metrics_log')
      .insert(metrics);

    if (error) {
      throw new Error(`Failed to insert metrics: ${error.message}`);
    }

    console.log(`Successfully inserted ${metrics.length} metrics`);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seedMetrics();
