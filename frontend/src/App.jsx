import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import StatsGrid from './components/StatsGrid';
import CityChart from './components/CityChart';
import AIInsightFeed from './components/AIInsightFeed';
import { RefreshCw, Activity, MapPin, Settings, Sparkles } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [kpis, setKpis] = useState(null);
  const [zones, setZones] = useState([]);
  const [insights, setInsights] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [summaryRes, insightsRes, metricsRes] = await Promise.all([
        fetch(`${API_URL}/dashboard/summary`).then(r => r.json()),
        fetch(`${API_URL}/dashboard/insights/active`).then(r => r.json()),
        fetch(`${API_URL}/metrics/history`).then(r => r.json())
      ]);
      
      setKpis(summaryRes.kpis);
      setZones(summaryRes.zones || []);
      setInsights(insightsRes || []);
      setChartData(metricsRes || []);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerAnomaly = async () => {
    try {
      await fetch(`${API_URL}/debug/trigger`, { method: 'POST' });
      setTimeout(fetchDashboard, 2000);
    } catch (error) {
      console.error('Trigger error:', error);
    }
  };

  const filteredChartData = selectedZone 
    ? chartData.filter(d => d.zone_id === selectedZone)
    : chartData;

  const recentData = [...filteredChartData].reverse().slice(0, 20);

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar view={view} onViewChange={setView} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {view === 'dashboard' && 'Dashboard'}
              {view === 'zones' && 'Zones'}
              {view === 'ai' && 'AI Insights'}
              {view === 'settings' && 'Settings'}
            </h1>
            <p className="text-slate-400">Real-time Smart City Monitoring • Almaty, Kazakhstan</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchDashboard}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleTriggerAnomaly}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4 inline mr-1" />
              Demo
            </button>
          </div>
        </div>

        <StatsGrid kpis={kpis} />

        {view === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-4">
                <label className="text-slate-400 text-sm">Zone:</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedZone(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedZone === null 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    All Zones
                  </button>
                  {zones.map(z => (
                    <button
                      key={z.id}
                      onClick={() => setSelectedZone(z.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedZone === z.id 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {z.name}
                    </button>
                  ))}
                </div>
              </div>
              <CityChart data={recentData} selectedZone={selectedZone ? zones.find(z => z.id === selectedZone)?.name : 'All Zones'} />
            </div>
            
            <div className="lg:col-span-1">
              <AIInsightFeed insights={insights} />
            </div>
          </div>
        )}

        {view === 'zones' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zones.map(zone => (
              <div key={zone.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{zone.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{zone.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">PM2.5</span>
                    <span className={`font-medium ${zone.pm25_level > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {zone.pm25_level} μg/m³
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Traffic Speed</span>
                    <span className="text-white font-medium">{zone.traffic_speed} km/h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'ai' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">AI Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-2">Anomaly Detection</div>
                  <div className="text-emerald-400 font-medium">Active</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-2">Update Interval</div>
                  <div className="text-white font-medium">15 seconds</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-2">LLM Model</div>
                  <div className="text-white font-medium">Gemini 2.0</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-2">Insights Generated</div>
                  <div className="text-white font-medium">{insights.length}</div>
                </div>
              </div>
            </div>
            <AIInsightFeed insights={insights} />
          </div>
        )}

        {view === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">System Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-800">
                <div>
                  <div className="text-white">Auto-refresh Data</div>
                  <div className="text-slate-500 text-sm">Update dashboard every 10 seconds</div>
                </div>
                <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-800">
                <div>
                  <div className="text-white">AI Insights</div>
                  <div className="text-slate-500 text-sm">Enable AI-powered anomaly detection</div>
                </div>
                <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-800">
                <div>
                  <div className="text-white">Notifications</div>
                  <div className="text-slate-500 text-sm">Show alert notifications</div>
                </div>
                <div className="w-12 h-6 bg-slate-700 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
