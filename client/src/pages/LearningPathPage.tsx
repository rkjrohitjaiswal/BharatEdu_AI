import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { fetchStudentDashboard } from '../services/api';
import { StudentDashboardData } from '../types';
import { CheckCircle2, BookOpen, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const LearningPathPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStudentDashboard().then((res) => {
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  const masteries = dashboardData?.mastery || [];
  const recommendedTopics = (dashboardData?.learningProfile?.recommendedTopics || []).filter(
    (t) => typeof t === 'object' && t !== null
  );
  const classLevel = dashboardData?.studentProfile?.classLevel || 8;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personalized Learning Path"
        description="Structured roadmap designed specifically around your grade level, learning pace, and goals."
        badge={<Badge variant="emerald">Curriculum Roadmap</Badge>}
      />

      <Card title="Current Curriculum Roadmap" subtitle={`Class ${classLevel} NCERT Curriculum • Adaptive Learning Stream`}>
        {masteries.length === 0 && recommendedTopics.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 space-y-2">
            <Compass className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No Learning Path Generated Yet</p>
            <p className="text-slate-400">Complete initial practice or doubt solving to populate your personalized roadmap.</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {/* Mastered / Attempted Modules */}
            {masteries.map((m, idx) => {
              const topicName = typeof m.topicId === 'object' && m.topicId !== null ? m.topicId.name : `Module ${idx + 1}`;
              const topicDesc = typeof m.topicId === 'object' && m.topicId !== null ? m.topicId.description : '';
              const isMastered = m.status === 'mastered' || (m.masteryScore || 0) >= 80;

              return (
                <div key={m._id || idx} className="flex items-start gap-4 relative">
                  <div
                    className={`w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                      isMastered ? 'bg-emerald-600' : 'bg-sky-500'
                    }`}
                  >
                    {isMastered ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">{topicName}</h4>
                      <Badge variant={isMastered ? 'emerald' : 'blue'} size="sm">
                        {isMastered ? 'Mastered' : `${m.masteryScore}% Mastery`}
                      </Badge>
                    </div>
                    {topicDesc && <p className="text-xs text-slate-500 mt-1">{topicDesc}</p>}
                  </div>
                </div>
              );
            })}

            {/* Recommended Next Topics */}
            {recommendedTopics.map((rec: any, idx) => (
              <div key={rec._id || idx} className="flex items-start gap-4 relative">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 z-10">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">{rec.name}</h4>
                      <Badge variant="purple" size="sm">Recommended Next</Badge>
                    </div>
                    <Link to="/practice">
                      <Button size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>Start Practice</Button>
                    </Link>
                  </div>
                  {rec.description && <p className="text-xs text-slate-500 mt-1">{rec.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
