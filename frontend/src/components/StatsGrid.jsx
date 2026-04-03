import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind, Gauge, AlertTriangle, Heart } from 'lucide-react';

export default function StatsGrid({ kpis }) {
  const stats = [
    {
      title: 'Avg Air Quality (PM2.5)',
      value: kpis?.avgAirQuality || '--',
      icon: Wind,
      color: kpis?.avgAirQuality > 100 ? 'text-red-400' : 'text-emerald-400',
      bg: kpis?.avgAirQuality > 100 ? 'bg-red-500/10' : 'bg-emerald-500/10',
    },
    {
      title: 'Traffic Flow %',
      value: kpis?.trafficFlow || '--',
      icon: Gauge,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Active Alerts',
      value: kpis?.activeAlerts || 0,
      icon: AlertTriangle,
      color: (kpis?.activeAlerts || 0) > 0 ? 'text-red-400' : 'text-slate-400',
      bg: (kpis?.activeAlerts || 0) > 0 ? 'bg-red-500/10' : 'bg-slate-800',
    },
    {
      title: 'System Health',
      value: kpis?.systemHealth || 'Checking...',
      icon: Heart,
      color: kpis?.systemHealth === 'Healthy' ? 'text-emerald-400' : 'text-yellow-400',
      bg: kpis?.systemHealth === 'Healthy' ? 'bg-emerald-500/10' : 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              {stat.title}
            </CardTitle>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
