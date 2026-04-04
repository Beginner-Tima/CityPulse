import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { question, context } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        const metricsSummary = context?.metrics?.slice(-10).map(m => 
            `Zone: ${m.zone_id?.substring(0,8) || 'Unknown'}, PM2.5: ${m.pm25_level} μg/m³, Traffic: ${m.traffic_speed} km/h`
        ).join('. ') || 'Current metrics show varied air quality across districts';
        
        const zonesInfo = context?.zones?.map(z => 
            `${z.name}: PM2.5=${z.pm25_level} μg/m³, Traffic=${z.traffic_speed} km/h`
        ).join('. ') || 'All zones monitored';
        
        const q = question.toLowerCase();
        
        // Simple rule-based responses for common questions
        if (q.includes('air quality') || q.includes('pm25') || q.includes('pollution')) {
            const avgPM = context?.zones?.reduce((sum, z) => sum + (z.pm25_level || 0), 0) / (context.zones?.length || 1) || 0;
            if (avgPM > 80) {
                return res.json({ response: `⚠️ Air quality is currently UNHEALTHY. Average PM2.5 level is ${Math.round(avgPM)} μg/m³. Recommendation: Stay indoors, avoid outdoor activities.` });
            } else if (avgPM > 50) {
                return res.json({ response: `🟡 Air quality is MODERATE. Average PM2.5 is ${Math.round(avgPM)} μg/m³. Sensitive individuals should limit prolonged outdoor exposure.` });
            } else {
                return res.json({ response: `✅ Air quality is GOOD! Average PM2.5 is ${Math.round(avgPM)} μg/m³. Perfect conditions for outdoor activities.` });
            }
        }
        
        if (q.includes('traffic') || q.includes('speed') || q.includes('congestion')) {
            const avgSpeed = context?.zones?.reduce((sum, z) => sum + (z.traffic_speed || 0), 0) / (context.zones?.length || 1) || 0;
            if (avgSpeed < 25) {
                return res.json({ response: `🚗 Traffic is HEAVY. Average speed is ${Math.round(avgSpeed)} km/h. Consider alternative routes.` });
            } else if (avgSpeed < 40) {
                return res.json({ response: `🚙 Traffic is MODERATE. Average speed ${Math.round(avgSpeed)} km/h. Normal commute times expected.` });
            } else {
                return res.json({ response: `🛣️ Traffic is LIGHT. Average speed ${Math.round(avgSpeed)} km/h. Good conditions for driving.` });
            }
        }
        
        if (q.includes('alatau') || q.includes('bostandyk') || q.includes('medeu')) {
            const zoneName = q.includes('alatau') ? 'Alatau District' : q.includes('bostandyk') ? 'Bostandyk District' : 'Medeu District';
            const zone = context?.zones?.find(z => z.name === zoneName);
            if (zone) {
                return res.json({ response: `📍 ${zoneName}: PM2.5 = ${zone.pm25_level} μg/m³, Traffic Speed = ${zone.traffic_speed} km/h. ${zone.pm25_level > 50 ? 'Air quality is elevated in this area.' : 'Conditions are normal.'}` });
            }
        }
        
        if (q.includes('which') || q.includes('worst') || q.includes('best')) {
            const sorted = [...(context?.zones || [])].sort((a, b) => b.pm25_level - a.pm25_level);
            const worst = sorted[0];
            const best = sorted[sorted.length - 1];
            return res.json({ response: `📊 Worst air quality: ${worst?.name} (PM2.5: ${worst?.pm25_level}). Best: ${best?.name} (PM2.5: ${best?.pm25_level}).` });
        }
        
        // Use Gemini for other questions
        if (!GEMINI_API_KEY) {
            return res.json({ response: "I can help you with specific questions about air quality (PM2.5), traffic conditions, or specific zones (Alatau, Bostandyk, Medeu). Try asking 'What's the air quality?' or 'How's traffic in Alatau?'" });
        }
        
        const prompt = `You are a helpful AI assistant for a Smart City Dashboard in Almaty, Kazakhstan. You help people understand city metrics.

CURRENT DATA:
- ${metricsSummary}
- ${zonesInfo}

User asks: "${question}"

Give a short, helpful answer (1-2 sentences). Be specific about the numbers if possible.`;
        
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
            }
        );
        
        const text = response.data.candidates[0].content.parts[0].text;
        res.json({ response: text });
    } catch (error) {
        console.error('Chat error:', error.message);
        res.json({ response: "I have all the current city data. Ask me about air quality, traffic, or any specific zone (Alatau, Bostandyk, Medeu)!" });
    }
});

export default router;