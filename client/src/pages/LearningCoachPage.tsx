import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { fetchTodayLearningCoach } from '../services/api';
import {
  Bot,
  Sparkles,
  Target,
  Clock,
  BrainCircuit,
  AlertTriangle,
  Award,
  CheckCircle2,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LearningCoachPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [coachData, setCoachData] = useState<any>(null);

  useEffect(() => {
    loadCoachPlan();
  }, []);

  const loadCoachPlan = async () => {
    setLoading(true);
    const res = await fetchTodayLearningCoach();
    if (res.success && res.data) {
      setCoachData(res.data);
    }
    setLoading(false);
  };

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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <Badge variant="amber">Critical</Badge>;
      case 'HIGH':
        return <Badge variant="amber">High Priority</Badge>;
      case 'MEDIUM':
        return <Badge variant="purple">Medium</Badge>;
      default:
        return <Badge variant="slate">Regular</Badge>;
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!coachData) {
    return (
      <Card>
        <div className="py-8 text-center text-xs text-slate-500">
          Failed to load your AI Learning Coach daily plan.
        </div>
      </Card>
    );
  }

  const {
    greeting,
    readiness,
    dailyGoal,
    recommendations,
    availableMinutes,
    remainingMinutes,
    streak,
    motivation,
    aiEnhanced,
  } = coachData;

  const plannedMinutes = availableMinutes - remainingMinutes;

  return (
    <div className="space-y-6 text-xs max-w-5xl mx-auto">
      <PageHeader
        title="AI Learning Coach"
        description="Daily personalized guidance combining your mastery, learning gaps, study plan, and practice streak."
        badge={<Badge variant="purple">{aiEnhanced ? 'AI Powered' : 'Deterministic Engine'}</Badge>}
      />

      {/* Greeting & Readiness Banner */}
      <div className="p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl text-white space-y-4 shadow-xl">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-400" />
              {greeting}
            </h2>
            <p className="text-purple-200 text-sm">{readiness.explanation}</p>
          </div>
          {getReadinessBadge(readiness.label, readiness.score)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-purple-800/60 text-xs">
          <div className="flex items-center gap-2 bg-purple-800/40 p-2.5 rounded-xl border border-purple-700/50">
            <Target className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-purple-300 block text-[10px]">Today's Focus</span>
              <strong className="text-white text-xs">{dailyGoal}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-800/40 p-2.5 rounded-xl border border-purple-700/50">
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <span className="text-purple-300 block text-[10px]">Time Budget</span>
              <strong className="text-white text-xs">{plannedMinutes} / {availableMinutes} min planned</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-800/40 p-2.5 rounded-xl border border-purple-700/50">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-purple-300 block text-[10px]">Practice Streak</span>
              <strong className="text-white text-xs">{streak} Days Active</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Prioritized Tasks List */}
      <Card title="Today's Prioritized Learning Plan" subtitle="Tasks ordered by learning impact and prerequisite necessity">
        <div className="space-y-3">
          {(recommendations || []).map((rec: any, idx: number) => (
            <div
              key={rec.id}
              className="p-4 bg-white border border-slate-200 hover:border-purple-300 rounded-xl space-y-2 shadow-2xs transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
                  {getPriorityBadge(rec.priority)}
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  {rec.estimatedMinutes} mins
                </span>
              </div>

              <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{rec.reason}</p>

              <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                <span className="text-slate-400 text-[11px]">
                  Subject: <strong className="text-slate-700">{rec.subject}</strong> • Topic: <strong className="text-slate-700">{rec.topic}</strong>
                </span>

                <Link to={rec.targetRoute}>
                  <Button size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Start {rec.action.replace('_', ' ')}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
