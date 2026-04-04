import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { question, context } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        console.log('Chat request - API Key exists:', !!GEMINI_API_KEY);
        
        if (!GEMINI_API_KEY) {
            const fallback = generateFallbackResponse(question, context);
            return res.json({ response: fallback });
        }
        
        const zonesData = (context?.zones || []).map(z => 
            `${z.name}: PM2.5 = ${z.pm25_level} μg/m³, Traffic Speed = ${z.traffic_speed} km/h`
        ).join('\n');
        
        const metricsData = (context?.metrics?.slice(-5) || []).map(m => 
            `Time: ${new Date(m.created_at).toLocaleString('ru-RU')}, PM2.5: ${m.pm25_level}, Speed: ${m.traffic_speed}`
        ).join('\n');
        
        const prompt = `You are an AI assistant for CityPulse Smart City Dashboard in Almaty, Kazakhstan.

CURRENT ZONE DATA:
${zonesData}

RECENT METRICS:
${metricsData}

USER QUESTION: ${question}

Answer briefly (1-2 sentences). Use the numbers above to be specific.`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.8, maxOutputTokens: 300 }
            }
        );
        
        const text = response.data.candidates[0].content.parts[0].text;
        res.json({ response: text });
        
    } catch (error) {
        console.error('Chat error:', error.message);
        const fallback = generateFallbackResponse(req.body.question, req.body.context);
        res.json({ response: fallback });
    }
});

function generateFallbackResponse(question, context) {
    const q = (question || '').toLowerCase();
    const zones = context?.zones || [];
    
    if (q.includes('air') || q.includes('pm25') || q.includes('воздух')) {
        const avg = zones.length ? Math.round(zones.reduce((s, z) => s + (z.pm25_level || 0), 0) / zones.length) : 0;
        if (avg > 80) return `⚠️ Air quality is UNHEALTHY. Average PM2.5: ${avg} μg/m³. Stay indoors.`;
        if (avg > 50) return `🟡 Air quality is MODERATE. Average PM2.5: ${avg} μg/m³.`;
        return `✅ Air quality is GOOD. Average PM2.5: ${avg} μg/m³.`;
    }
    
    if (q.includes('traffic') || q.includes('speed') || q.includes('трафик')) {
        const avg = zones.length ? Math.round(zones.reduce((s, z) => s + (z.traffic_speed || 0), 0) / zones.length) : 0;
        if (avg < 25) return `🚗 Traffic is HEAVY. Average speed: ${avg} km/h.`;
        if (avg < 40) return `🚙 Traffic is MODERATE. Average speed: ${avg} km/h.`;
        return `🛣️ Traffic is LIGHT. Average speed: ${avg} km/h.`;
    }
    
    const zoneInfo = zones.map(z => `${z.name}: PM2.5=${z.pm25_level}, Traffic=${z.traffic_speed}`).join('. ');
    return `📊 Current data: ${zoneInfo}. Ask about air quality or traffic!`;
}

export default router;