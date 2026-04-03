import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CityChart({ data, selectedZone }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const formatted = data.map(item => ({
        time: new Date(item.created_at).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        pm25: item.pm25_level,
        speed: item.traffic_speed,
      }));
      setChartData(formatted);
    }
  }, [data]);

  return (
    <div className="h-[400px] bg-slate-900 border border-slate-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        {selectedZone || 'All Zones'} — Traffic & Air Quality
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="pm25" 
            name="PM2.5 (μg/m³)"
            stroke="#ef4444" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="speed" 
            name="Traffic Speed (km/h)"
            stroke="#22c55e" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
