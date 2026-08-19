import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Users, TrendingUp, Flame, Clock, Award } from 'lucide-react';

interface ParentWelcomeProps {
  parentUser: any;
  linkedStudents: any[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  overviewData: any;
}

export const ParentWelcome: React.FC<ParentWelcomeProps> = ({
  parentUser,
  linkedStudents,
  selectedStudentId,
  onSelectStudent,
  overviewData,
}) => {
  const currentStudent = linkedStudents.find(
    (s) => String(s.student?._id || s.student?.id || s.student) === String(selectedStudentId)
  )?.student;

  const studentName = currentStudent?.name || overviewData?.student?.name || 'Student';
  const classLevel = overviewData?.student?.classLevel || 8;
  const overallMastery = overviewData?.overallMastery ?? 0;
  const trend = overviewData?.progressTrend?.trend || 'stable';
  const streak = overviewData?.practiceStreak || 0;
  const studyTimeMinutes = overviewData?.totalPracticeTimeMinutes || 0;

  const getTrendBadge = (t: string) => {
    switch (t) {
      case 'improving':
        return <Badge variant="emerald">↗ Improving</Badge>;
      case 'needs_attention':
        return <Badge variant="amber">⚠ Needs Attention</Badge>;
      default:
        return <Badge variant="purple">→ Stable</Badge>;
    }
  };

  return (
    <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white border-none shadow-xl">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold flex items-center gap-2 text-white">
              <Users className="w-6 h-6 text-purple-400" />
              Parent Learning Dashboard
            </h1>
            <p className="text-slate-300 text-xs">
              Welcome back, {parentUser?.name || 'Parent'}! Monitoring learning progress for{' '}
              <strong className="text-purple-200">{studentName}</strong> (Class {classLevel}).
            </p>
          </div>

          {/* Student Selector */}
          {linkedStudents.length > 0 && (
            <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/15">
              <span className="text-xs text-purple-200 font-semibold pl-1">My Students:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => onSelectStudent(e.target.value)}
                className="bg-purple-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg border border-purple-700 focus:outline-none cursor-pointer"
              >
                {linkedStudents.map((ls) => {
                  const s = ls.student;
                  const sid = String(s?._id || s?.id || s);
                  return (
                    <option key={sid} value={sid}>
                      {s?.name || 'Student'} (Class {classLevel})
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-purple-200 text-[11px] block font-medium">Overall Mastery</span>
            <span className="text-xl font-extrabold text-white">{overallMastery}%</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-purple-200 text-[11px] block font-medium">Learning Trend</span>
            <div className="pt-0.5">{getTrendBadge(trend)}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-purple-200 text-[11px] flex items-center gap-1 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Practice Streak
            </span>
            <span className="text-xl font-extrabold text-white">{streak} Days</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-purple-200 text-[11px] flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-sky-400" /> Practice Time
            </span>
            <span className="text-xl font-extrabold text-white">
              {Math.floor(studyTimeMinutes / 60)}h {studyTimeMinutes % 60}m
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
