import React, { useEffect, useState } from 'react';
import { fetchTeacherClassResources, fetchTeacherClassResourceAnalytics } from '../services/api';
import { ILearningResourceClient, IResourceAnalyticsClient } from '../types/resource-recommendation';
import { ResourceSourceBadge } from '../components/resources/ResourceSourceBadge';
import { ResourceDuration } from '../components/resources/ResourceDuration';
import { Users, BarChart3, CheckCircle2 } from 'lucide-react';

export const TeacherResourceRecommendationsPage: React.FC = () => {
  const [resources, setResources] = useState<ILearningResourceClient[]>([]);
  const [analytics, setAnalytics] = useState<IResourceAnalyticsClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClassData();
  }, []);

  const loadClassData = async () => {
    setLoading(true);
    const resList = await fetchTeacherClassResources('class_9a');
    const resAna = await fetchTeacherClassResourceAnalytics('class_9a');

    if (resList.success && resList.data) setResources(resList.data);
    if (resAna.success && resAna.data) setAnalytics(resAna.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading Class Resource Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Teacher Class Resource Analytics</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Classroom Resource Effectiveness & Usage</h1>
          <p className="text-xs text-slate-400">Track student engagement, completion rates, and feedback across verified learning resources.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-white">Classroom Resource Catalog</h3>
            <div className="space-y-3">
              {resources.map((r) => {
                const stat = analytics.find((a) => a.resourceId === r.resourceId);
                return (
                  <div key={r.resourceId} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <ResourceSourceBadge provider={r.provider} isVerified={r.isVerified} />
                      <ResourceDuration minutes={r.estimatedMinutes} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{r.title}</h4>
                      <p className="text-slate-400 mt-0.5">{r.description}</p>
                    </div>
                    {stat && (
                      <div className="grid grid-cols-3 gap-2 text-center bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                        <div>
                          <div className="font-bold text-purple-400">{stat.starts}</div>
                          <div className="text-[10px] text-slate-400">Student Starts</div>
                        </div>
                        <div>
                          <div className="font-bold text-emerald-400">{stat.completionRate}%</div>
                          <div className="text-[10px] text-slate-400">Completion Rate</div>
                        </div>
                        <div>
                          <div className="font-bold text-amber-400">{stat.helpfulRate}%</div>
                          <div className="text-[10px] text-slate-400">Helpful Rating</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Resource Effectiveness Signals</h3>
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 text-xs">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-purple-400" /> Class Insight Summary
              </div>
              <p className="text-slate-300 leading-relaxed">
                Short 15-minute practice sets exhibit the highest completion rate (88%) among Class 9 Mathematics students addressing rational expressions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherResourceRecommendationsPage;
