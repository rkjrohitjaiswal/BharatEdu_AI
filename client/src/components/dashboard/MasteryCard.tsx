import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { StudentLearningProfile } from '../../types';
import { CheckCircle, AlertCircle, Award } from 'lucide-react';

interface MasteryCardProps {
  learningProfile: StudentLearningProfile;
}

export const MasteryCard: React.FC<MasteryCardProps> = ({ learningProfile }) => {
  const mastery = learningProfile?.overallMastery || 0;
  const strengths = learningProfile?.strengths || [];
  const weaknesses = learningProfile?.weaknesses || [];

  return (
    <Card title="Overall Learning Mastery" subtitle="Competency progress visualization">
      <div className="space-y-6">
        {/* Progress Gauge Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700">Mastery Level</span>
            <span className="font-extrabold text-emerald-600 text-sm">{mastery}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 border border-slate-200">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(mastery, 5)}%` }}
            ></div>
          </div>
        </div>

        {/* Strengths & AreasNeeding Improvement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
          {/* Strengths */}
          <div className="space-y-2">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Strong Areas</span>
            </p>
            {strengths.length === 0 ? (
              <p className="text-slate-400 italic">No strength areas identified yet.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {strengths.map((str, i) => (
                  <Badge key={i} variant="emerald" size="sm">
                    {str}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Areas Needing Improvement */}
          <div className="space-y-2">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Needs Improvement</span>
            </p>
            {weaknesses.length === 0 ? (
              <p className="text-slate-400 italic">No weakness areas flagged.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {weaknesses.map((weak, i) => (
                  <Badge key={i} variant="amber" size="sm">
                    {weak}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {mastery === 0 && strengths.length === 0 && weaknesses.length === 0 && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 text-center">
            Complete your first learning assessment or practice session to build your personalized mastery profile.
          </div>
        )}
      </div>
    </Card>
  );
};
