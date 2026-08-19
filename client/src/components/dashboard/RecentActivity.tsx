import React from 'react';
import { Card } from '../Card';
import { EngagementEventItem } from '../../types';
import { Activity, BookOpen, BrainCircuit, CheckCircle2, Bot, HelpCircle } from 'lucide-react';

interface RecentActivityProps {
  events: EngagementEventItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ events }) => {
  const getEventMeta = (eventType: string) => {
    switch (eventType) {
      case 'lesson_completed':
        return { label: 'Completed Lesson', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' };
      case 'lesson_started':
        return { label: 'Started Lesson', icon: BookOpen, color: 'text-sky-600 bg-sky-50' };
      case 'practice_started':
      case 'practice_completed':
        return { label: 'Adaptive Practice', icon: BrainCircuit, color: 'text-purple-600 bg-purple-50' };
      case 'question_asked':
        return { label: 'Asked AI Tutor', icon: Bot, color: 'text-teal-600 bg-teal-50' };
      default:
        return { label: 'Learning Activity', icon: Activity, color: 'text-slate-600 bg-slate-50' };
    }
  };

  const formatTime = (ts: string) => {
    try {
      const date = new Date(ts);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <Card title="Recent Activity" subtitle="Human-readable timeline of study sessions">
      {events.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500 space-y-2">
          <Activity className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No Recent Activity</p>
          <p className="text-slate-400">Activity logs will appear as you interact with lessons and practice tools.</p>
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
          {events.map((event) => {
            const meta = getEventMeta(event.eventType);
            const Icon = meta.icon;

            return (
              <div key={event._id} className="flex items-start gap-3 relative z-10 text-xs">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${meta.color} shrink-0 border border-slate-200`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-slate-900">{meta.label}</p>
                    <span className="text-[10px] text-slate-400">{formatTime(event.timestamp)}</span>
                  </div>
                  {event.metadata && event.metadata.topicName && (
                    <p className="text-slate-500 mt-0.5">{event.metadata.topicName}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
