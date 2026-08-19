import React, { useEffect, useState } from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { fetchTodayLearningCoach } from '../../services/api';
import {
  Bot,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LearningCoachCard: React.FC = () => {
  const [coachData, setCoachData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTodayLearningCoach().then((res) => {
      if (res.success && res.data) {
        setCoachData(res.data);
      }
      setLoading(false);
    });
  }, []);

  const getReadinessBadge = (label: string, score: number) => {
    switch (label) {
      case 'Needs Attention':
        return <Badge variant="amber">{score}% • Needs Attention</Badge>;
      case 'Building Momentum':
        return <Badge variant="purple">{score}% • Building Momentum</Badge>;
      case 'Strong Progress':
        return <Badge variant="emerald">{score}% • Strong Progress</Badge>;
      default:
        return <Badge variant="emerald">{score}% • On Track</Badge>;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'mistake_review':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case 'tutor':
        return <Bot className="w-3.5 h-3.5 text-purple-600" />;
      case 'scholarship':
        return <Award className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  if (loading) {
    return (
      <Card title="AI Learning Coach">
        <div className="py-6 text-center text-xs text-slate-400">Loading daily learning plan...</div>
      </Card>
    );
  }

  if (!coachData) return null;

  const { greeting, readiness, dailyGoal, recommendations, availableMinutes, motivation } = coachData;
  const plannedMinutes = (recommendations || []).reduce((sum: number, r: any) => sum + (r.estimatedMinutes || 0), 0);

  return (
    <Card
      title="AI Learning Coach"
      subtitle="Today's personalized learning guidance"
      action={
        <Link to="/learning-coach">
          <Button size="sm" variant="outline" icon={<ArrowRight className="w-3.5 h-3.5" />}>
            Full Plan
          </Button>
        </Link>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Readiness Header */}
        <div className="p-3.5 bg-gradient-to-r from-purple-50 via-emerald-50 to-purple-50 border border-purple-100 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 font-bold text-purple-950">
              <Bot className="w-4 h-4 text-purple-600" />
              <span>{greeting}</span>
            </div>
            {getReadinessBadge(readiness.label, readiness.score)}
          </div>

          <p className="text-slate-700 font-semibold flex items-start gap-1.5">
            <Target className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Today's Goal: {dailyGoal}</span>
          </p>
        </div>

        {/* Prioritized Recommendations */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-slate-500 font-bold text-[11px] uppercase tracking-wider px-1">
            <span>TODAY'S PRIORITIZED PLAN</span>
            <span>{plannedMinutes} / {availableMinutes} min planned</span>
          </div>

          {(recommendations || []).slice(0, 4).map((rec: any) => (
            <div
              key={rec.id}
              className="p-3 bg-white border border-slate-200 hover:border-purple-300 rounded-xl flex items-center justify-between gap-3 shadow-2xs transition-all"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                  {getActionIcon(rec.action)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{rec.title}</h4>
                  <p className="text-slate-500 text-[11px] truncate">{rec.reason}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {rec.estimatedMinutes} min
                </span>
                <Link to={rec.targetRoute}>
                  <Button size="sm" variant="secondary" icon={<ArrowRight className="w-3 h-3" />}>
                    Start
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Footer */}
        {motivation && (
          <p className="text-[11px] text-purple-800 italic bg-purple-50/50 p-2 rounded-lg text-center border border-purple-100">
            "{motivation}"
          </p>
        )}
      </div>
    </Card>
  );
};
