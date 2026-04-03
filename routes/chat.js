import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { question, context } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        if (!GEMINI_API_KEY) {
            return res.json({ 
                response: "AI chatbot requires a Gemini API key. Please set GEMINI_API_KEY in your .env file."
            });
        }
        
        const metricsSummary = context?.metrics?.slice(-20).map(m => 
            `PM2.5: ${m.pm25_level} μg/m³, Traffic: ${m.traffic_speed} km/h, Time: ${new Date(m.created_at).toISOString()}`
        ).join('\n') || 'No recent metrics';
        
        const zonesInfo = context?.zones?.map(z => 
            `${z.name}: PM2.5=${z.pm25_level}, Traffic=${z.traffic_speed}`
        ).join('\n') || 'No zone data';
        
        const prompt = `You are a Smart City AI Assistant for Almaty, Kazakhstan. You help users understand city metrics, air quality, traffic, and anomalies.

CURRENT CITY DATA:
${metricsSummary}

ZONE STATUS:
${zonesInfo}

User question: ${question}

Provide a helpful, concise response about the city metrics. If the user asks about specific zones or metrics, reference the data above.`;
        
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            }
        );
        
        const text = response.data.candidates[0].content.parts[0].text;
        res.json({ response: text });
    } catch (error) {
        console.error('Chat error:', error.message);
        res.json({ 
            response: "I apologize, I'm having trouble processing your request. Try asking about current metrics like 'What is the air quality?' or 'How is traffic in Alatau?'"
        });
    }
});

export default router;