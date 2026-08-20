import React, { useEffect, useState } from 'react';
import { fetchParentChildResources } from '../services/api';
import { IResourceRecommendationClient } from '../types/resource-recommendation';
import { ResourceRecommendationCard } from '../components/resources/ResourceRecommendationCard';
import { HeartHandshake, BookOpen } from 'lucide-react';

export const ParentResourceRecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<IResourceRecommendationClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildResources();
  }, []);

  const loadChildResources = async () => {
    setLoading(true);
    const res = await fetchParentChildResources('student_1');
    if (res.success && res.data) {
      setRecommendations(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading Child Resource Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Parent Resource Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Recommended Resources for Your Child</h1>
          <p className="text-xs text-slate-400">View verified study materials, practice sets, and NCERT chapters recommended for your child.</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" /> Child's Recommended Study Materials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <ResourceRecommendationCard key={rec.recommendationId || rec.resourceId} recommendation={rec} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentResourceRecommendationsPage;
