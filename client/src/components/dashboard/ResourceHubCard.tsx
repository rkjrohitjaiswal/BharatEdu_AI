import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchRecommendedResources } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ResourceHubCard: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.id) {
      fetchRecommendedResources()
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setRecommendations(res.data.slice(0, 3));
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  if (loading) {
    return <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse h-32" />;
  }

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Recommended Study Resources</h3>
            <p className="text-[11px] text-slate-500 font-medium">Curated for your current learning gaps</p>
          </div>
        </div>

        <Link
          to="/resources"
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
        >
          <span>Resource Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[9px] font-bold text-indigo-700 uppercase">
                <span>{rec.subject}</span>
                <span className="text-slate-400 font-semibold">{rec.estimatedMinutes}m</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs line-clamp-1 mt-0.5">{rec.title}</h4>
              <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{rec.reason}</p>
            </div>

            <Link
              to="/resources"
              className="inline-flex items-center justify-center gap-1 w-full py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition mt-2"
            >
              <span>Study Now</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
