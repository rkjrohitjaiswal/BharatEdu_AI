import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { fetchResourceRecommendations } from '../../services/api';
import { IResourceRecommendationClient } from '../../types/learning-resource';

export const LearningResourceCard: React.FC = () => {
  const navigate = useNavigate();
  const [topRec, setTopRec] = useState<IResourceRecommendationClient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTopRecommendation();
  }, []);

  const loadTopRecommendation = async () => {
    setLoading(true);
    const res = await fetchResourceRecommendations();
    if (res.success && res.data && res.data.length > 0) {
      setTopRec(res.data[0]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      </div>
    );
  }

  const resource = topRec?.resource;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4 border border-indigo-700/40 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-indigo-300" />
          </div>
          <span className="text-xs font-black uppercase text-indigo-300 tracking-wider">
            AI Top Recommended Resource
          </span>
        </div>
        <button
          onClick={() => navigate('/resources')}
          className="text-xs font-extrabold text-indigo-300 hover:text-white flex items-center gap-1 transition"
        >
          Explore All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {resource ? (
        <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-xs text-indigo-200">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold uppercase text-[10px]">
              {resource.subject} • {resource.resourceType}
            </span>
            <span className="flex items-center gap-1 font-bold text-slate-300">
              <Clock className="w-3 h-3 text-indigo-400" /> {resource.estimatedMinutes} mins
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white leading-snug">
            {resource.title}
          </h3>

          <p className="text-xs text-indigo-100/80 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          {topRec?.reason && (
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-400/20 text-xs text-indigo-200 flex items-start gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{topRec.reason}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => navigate(`/resources/${resource.resourceId}`)}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
            >
              Start Resource
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-indigo-200">
          No resources recommended at this moment.
        </div>
      )}
    </div>
  );
};
