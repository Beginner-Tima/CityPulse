import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function generateAIInsight(zoneName, currentMetrics, historyMetrics) {
    if (!GEMINI_API_KEY) {
        console.log('⚠️ No Gemini API key - using mock response');
        return getMockResponse(zoneName);
    }

    const prompt = `
You are a Smart City AI Controller for ${zoneName}.

CURRENT METRICS:
- PM2.5: ${currentMetrics.pm25_level} μg/m³
- Traffic Speed: ${currentMetrics.traffic_speed} km/h

HISTORY DATA:
${JSON.stringify(historyMetrics.slice(-10), null, 2)}

Analyze these metrics and provide a disaster mitigation response in this EXACT JSON format:
{
  "severity": "low" | "med" | "high" | "critical",
  "summary": "Brief 2-3 sentence analysis",
  "action_plan": ["Action 1", "Action 2", "Action 3"]
}

Consider: PM2.5 > 100 is CRITICAL (health hazard), traffic_speed < 15 means severe congestion.
`.trim();

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                    responseMimeType: "application/json"
                }
            }
        );

        const text = response.data.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(text);
        
        console.log('✅ Gemini response:', parsed);
        return parsed;
    } catch (error) {
        console.error('LLM Error:', error.response?.data || error.message);
        return getMockResponse(zoneName);
    }
}

function getMockResponse(zoneName) {
    const responses = [
        {
            severity: 'high',
            summary: `Critical air quality alert in ${zoneName}. PM2.5 levels have exceeded safety thresholds. Traffic congestion detected. Immediate action required to protect public health.`,
            action_plan: [
                'Activate residential area air purification alerts',
                'Implement traffic redirection to alternative routes',
                'Notify health authorities and issue public warning'
            ]
        },
        {
            severity: 'high', 
            summary: `Severe pollution detected in ${zoneName} zone. Air quality index at dangerous levels with significant traffic slowdown. Recommend emergency protocols.`,
            action_plan: [
                'Deploy mobile air filtration units',
                'Open emergency ventilation corridors',
                'Restrict vehicle access in affected areas'
            ]
        },
        {
            severity: 'high',
            summary: `Environmental emergency in ${zoneName}. High PM2.5 concentration combined with low traffic flow indicates potential industrial incident or severe weather event.`,
            action_plan: [
                'Activate city-wide air monitoring network',
                'Dispatch environmental response team',
                'Prepare evacuation routes if necessary'
            ]
        }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}
