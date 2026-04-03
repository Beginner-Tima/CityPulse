import { Activity, MapPin, Settings, Zap, Sparkles } from 'lucide-react';

export default function Sidebar({ view = 'dashboard', onViewChange = () => {} }) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CityPulse</h1>
            <p className="text-xs text-slate-400">AI Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <button 
          onClick={() => onViewChange('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            view === 'dashboard' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </button>
        <button 
          onClick={() => onViewChange('zones')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            view === 'zones' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="font-medium">Zones</span>
        </button>
        <button 
          onClick={() => onViewChange('ai')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            view === 'ai' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">AI Insights</span>
        </button>
        <button 
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            view === 'settings' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Online</span>
        </div>
      </div>
    </aside>
  );
}
