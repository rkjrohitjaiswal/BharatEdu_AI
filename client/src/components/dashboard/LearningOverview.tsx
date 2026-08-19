import React from 'react';
import { Card } from '../Card';
import { Target, Flame, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StudentProfileData, StudentLearningProfile } from '../../types';

interface LearningOverviewProps {
  profile: StudentProfileData;
  learningProfile: StudentLearningProfile;
  stats: {
    masteredTopicsCount: number;
    needsReviewTopicsCount: number;
    activeGapsCount: number;
  };
}

export const LearningOverview: React.FC<LearningOverviewProps> = ({
  profile,
  learningProfile,
  stats,
}) => {
  const formatMinutes = (mins: number) => {
    if (mins < 60) return `${mins} mins`;
    const hrs = Math.floor(mins / 60);
    const remaining = mins % 60;
    return remaining > 0 ? `${hrs}h ${remaining}m` : `${hrs} hrs`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Mastery */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Overall Mastery</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {learningProfile?.overallMastery || 0}%
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>
      </Card>

      {/* Learning Streak */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Current Streak</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {profile?.currentStreak || 0} {profile?.currentStreak === 1 ? 'Day' : 'Days'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </Card>

      {/* Study Time */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Total Study Time</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {formatMinutes(profile?.totalLearningMinutes || 0)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </Card>

      {/* Mastered Topics */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Topics Mastered</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {stats?.masteredTopicsCount || 0}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </Card>
    </div>
  );
};
