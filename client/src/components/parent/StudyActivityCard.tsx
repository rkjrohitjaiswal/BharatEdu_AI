import React from 'react';
import { Card } from '../Card';
import { CheckCircle2, Calendar } from 'lucide-react';

interface StudyActivityCardProps {
  recentActivity: {
    title: string;
    timestamp: string;
    status: string;
  }[];
  studyPlanProgress: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
  };
}

export const StudyActivityCard: React.FC<StudyActivityCardProps> = ({ recentActivity, studyPlanProgress }) => {
  return (
    <Card title="Recent Progress & Study Tasks" subtitle="Recent completed practice activities">
      <div className="space-y-4 text-xs">
        {/* Study Plan Progress Bar */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
          <div className="flex justify-between items-center text-slate-700">
            <span className="font-bold">Scheduled Study Plan Tasks</span>
            <span className="font-extrabold text-slate-900">
              {studyPlanProgress.completedTasks} / {studyPlanProgress.totalTasks} Done
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full transition-all duration-500"
              style={{
                width: `${
                  studyPlanProgress.totalTasks > 0
                    ? Math.round((studyPlanProgress.completedTasks / studyPlanProgress.totalTasks) * 100)
                    : 50
                }%`,
              }}
            />
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="space-y-2">
          <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider block px-1">
            RECENT COMPLETED SESSIONS
          </span>

          {(!recentActivity || recentActivity.length === 0) ? (
            <p className="text-slate-500 text-center py-2">No recent study sessions recorded.</p>
          ) : (
            recentActivity.map((act, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{act.title}</span>
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {act.timestamp}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
