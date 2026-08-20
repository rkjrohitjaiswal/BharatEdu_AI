import { TrendingUp, TrendingDown, Minus, HelpCircle } from 'lucide-react';

export interface ProgressTrendCardProps {
  trend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
  title?: string;
  masteryScore?: number;
}

export const ProgressTrendCard: React.FC<ProgressTrendCardProps> = ({ trend, title = 'Progress Trend', masteryScore }) => {
  const renderIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'stable':
        return <Minus className="w-5 h-5 text-blue-500" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getLabel = () => {
    switch (trend) {
      case 'improving':
        return '↑ Improving';
      case 'declining':
        return '↓ Declining';
      case 'stable':
        return '→ Stable';
      default:
        return 'Not enough learning activity yet';
    }
  };

  const getBadgeClass = () => {
    switch (trend) {
      case 'improving':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'declining':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'stable':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        {masteryScore !== undefined && (
          <div className="text-2xl font-black text-slate-900">{masteryScore}%</div>
        )}
      </div>

      <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${getBadgeClass()}`}>
        {renderIcon()}
        <span>{getLabel()}</span>
      </div>
    </div>
  );
};
