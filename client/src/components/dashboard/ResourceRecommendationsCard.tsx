import React, { useEffect, useState } from 'react';
import { fetchTodayResources } from '../../services/api';
import { IResourceRecommendationClient } from '../../types/resource-recommendation';
import { BookOpen, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResourceRecommendationsCard: React.FC = () => {
  const [recommendations, setRecommendations] = useState<IResourceRecommendationClient[]>([]);

  useEffect(() => {
    loadToday();
  }, []);

  const loadToday = async () => {
    const res = await fetchTodayResources();
    if (res.success && res.data) {
      setRecommendations(res.data.slice(0, 3));
    }
  };

  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Recommended Resources</h3>
            <p className="text-xs text-slate-400">AI-matched for your target mastery</p>
          </div>
        </div>

        <Link
          to="/resources"
          className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <p className="text-xs text-slate-400">Loading recommendations...</p>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec.recommendationId || rec.resourceId}
              className="p-3.5 bg-slate-950/50 border border-slate-800/80 hover:border-purple-500/40 rounded-2xl space-y-2 text-xs transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate max-w-[200px]">{rec.resource?.title}</span>
                <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded">
                  {rec.priority}
                </span>
              </div>

              <p className="text-slate-300 text-[11px] line-clamp-1">{rec.reason}</p>

              <div className="flex items-center justify-between text-slate-400 text-[10px] pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {rec.resource?.estimatedMinutes || 15} mins
                </span>
                <Link
                  to={`/resources/${rec.resourceId}`}
                  className="font-bold text-purple-300 hover:underline"
                >
                  Open Resource →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResourceRecommendationsCard;
