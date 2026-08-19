import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Sparkles, Calendar } from 'lucide-react';

interface ParentInterventionAlertsProps {
  activeTeacherInterventions: {
    id: string;
    title: string;
    priority: string;
    status: string;
    dueDate: string;
    actionGuidance: string;
    subjectName: string;
  }[];
}

export const ParentInterventionAlerts: React.FC<ParentInterventionAlertsProps> = ({
  activeTeacherInterventions,
}) => {
  return (
    <Card title="Teacher Interventions & Tasks" subtitle="Targeted remediation tasks assigned by teachers">
      <div className="space-y-3 text-xs">
        {(!activeTeacherInterventions || activeTeacherInterventions.length === 0) ? (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
            No active teacher remediation assignments pending.
          </div>
        ) : (
          activeTeacherInterventions.map((task) => (
            <div
              key={task.id}
              className="p-3.5 bg-purple-50/60 border border-purple-200/70 rounded-xl space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-bold text-slate-900">{task.title}</span>
                </div>
                <Badge variant={task.priority === 'urgent' ? 'amber' : 'purple'}>{task.priority}</Badge>
              </div>

              <p className="text-slate-700 text-[11px] leading-relaxed">{task.actionGuidance}</p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-purple-100">
                <span>Subject: {task.subjectName}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Due: {task.dueDate}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
