import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  students: IClassroomIntelligenceClient['studentProfiles'];
}

export const StudentAttentionList: React.FC<Props> = ({ students }) => {
  const needy = students.filter((s) => s.riskScore >= 50 || s.interventionPriority === 'critical');

  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <Users className="w-5 h-5 text-rose-400" />
        Students Requiring Immediate Attention
      </h3>

      <div className="space-y-3">
        {needy.length === 0 ? (
          <p className="text-xs text-slate-400">All students are currently performing at or above baseline performance metrics.</p>
        ) : (
          needy.map((s) => (
            <div key={s.studentId} className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">{s.studentName || s.studentId}</div>
                <div className="text-slate-400">Mastery: {s.masteryScore}% • Accuracy: {s.practiceAccuracy}%</div>
              </div>
              <div className="text-right">
                <span className="text-rose-400 font-bold">Risk: {s.riskScore}</span>
                <div className="text-[10px] text-amber-400 capitalize">{s.interventionPriority} Priority</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentAttentionList;
