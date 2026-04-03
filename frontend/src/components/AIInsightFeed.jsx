import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ChevronRight } from 'lucide-react';

export default function AIInsightFeed({ insights, onApplyRecommendation }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'border-red-500/50 bg-red-500/5';
      case 'med':
        return 'border-orange-500/50 bg-orange-500/5';
      default:
        return 'border-emerald-500/50 bg-emerald-500/5';
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="border-b border-slate-800">
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          AI Dispatcher Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-3 p-4 max-h-[500px] overflow-y-auto">
          {insights?.length === 0 && (
            <p className="text-slate-500 text-center py-8">No active alerts</p>
          )}
          {insights?.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${getSeverityColor(insight.severity)} transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={insight.severity} className="uppercase">
                  {insight.severity}
                </Badge>
                <span className="text-xs text-slate-500">
                  {new Date(insight.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-slate-300 mb-3">{insight.summary}</p>
              <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase font-medium">Action Plan:</p>
                {insight.action_plan?.map((action, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <ChevronRight className="w-3 h-3 mt-0.5 text-emerald-400 flex-shrink-0" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
              {(insight.severity === 'high' || insight.severity === 'critical') && (
                <button
                  onClick={() => onApplyRecommendation?.(insight)}
                  className="mt-3 w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-md transition-colors"
                >
                  Apply Recommendation
                </button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
