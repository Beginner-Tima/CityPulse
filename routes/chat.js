import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { question, context } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        if (!GEMINI_API_KEY) {
            return res.json({ response: "🔧 AI requires GEMINI_API_KEY configuration. Please set it in environment variables." });
        }
        
        const zonesData = (context?.zones || []).map(z => 
            `${z.name}: PM2.5 = ${z.pm25_level} μg/m³, Traffic Speed = ${z.traffic_speed} km/h`
        ).join('\n');
        
        const metricsData = (context?.metrics?.slice(-5) || []).map(m => 
            `Time: ${new Date(m.created_at).toLocaleString('ru-RU', {timeZone: 'Asia/Almaty'})}, PM2.5: ${m.pm25_level}, Speed: ${m.traffic_speed}`
        ).join('\n');
        
        const prompt = `Ты — AI ассистент CityPulse для умного города Алматы, Казахстан. Твоя задача — помогать пользователям понимать городские метрики и давать полезные рекомендации.

ТЕКУЩИЕ ДАННЫЕ ПО ЗОНАМ:
${zonesData}

ПОСЛЕДНИЕ МЕТРИКИ:
${metricsData}

ВОПРОС ПОЛЬЗОВАТЕЛЯ: ${question}

Инструкции:
1. Отвечай на русском или английском (как спрашивают)
2. Будь конкретным — используй реальные числа из данных выше
3. Если спрашивают про воздух — анализируй PM2.5
4. Если спрашивают про трафик — анализируй скорость
5. Давай практические рекомендации
6. Отвечай кратко (2-3 предложения)`;
        
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 300,
                    topP: 0.9,
                    topK: 40
                }
            }
        );
        
        const text = response.data.candidates[0].content.parts[0].text;
        res.json({ response: text });
        
    } catch (error) {
        console.error('Chat error:', error.response?.data || error.message);
        res.json({ 
            response: "🤖 I'm here to help! Ask me about:\n• Air quality (PM2.5) in any zone\n• Traffic conditions\n• Best/worst zone for air quality\n• Specific questions about Alatau, Bostandyk, or Medeu"
        });
    }
});

export default router;