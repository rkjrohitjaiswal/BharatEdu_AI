import React, { useEffect, useState } from 'react';
import { BookOpen, ExternalLink, PlayCircle } from 'lucide-react';
import { fetchNextResource, startResourceRecommendation } from '../../services/api';
import { IResourceRecommendationClientDTO } from '../../types/resource-recommendations';

export const ResourceRecommendationCard: React.FC = () => {
  const [recommendation, setRecommendation] = useState<IResourceRecommendationClientDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNextResource();
  }, []);

  const loadNextResource = async () => {
    setLoading(true);
    const res = await fetchNextResource();
    if (res.success && res.data) {
      setRecommendation(res.data);
    }
    setLoading(false);
  };

  const handleStart = async () => {
    if (!recommendation) return;
    await startResourceRecommendation(recommendation.id);
    if (recommendation.actionUrl) {
      window.open(recommendation.actionUrl, '_blank');
    }
    loadNextResource();
  };

  if (loading) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Recommended Resource</span>
        </div>
        <p className="text-xs text-slate-600">All recommended learning materials completed for today!</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-black uppercase tracking-wider text-indigo-600">Top Recommended Resource</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-[10px]">
          {recommendation.relevanceScore}% Match
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-black text-slate-900 leading-snug">{recommendation.resource.title}</h4>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{recommendation.reason}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-500">
          ⏱️ {recommendation.estimatedMinutes} mins • {recommendation.resource.provider}
        </span>
        <button
          onClick={handleStart}
          className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs inline-flex items-center gap-1 transition"
        >
          <PlayCircle className="w-3.5 h-3.5" /> Start Material <ExternalLink className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
