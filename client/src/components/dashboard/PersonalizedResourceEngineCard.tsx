import React, { useEffect, useState } from 'react';
import { fetchStudentRecommendedResources } from '../../services/api';
import { BookOpen, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PersonalizedResourceEngineCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetchStudentRecommendedResources();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  const topRec = data?.topRecommendation;
  const resource = topRec?.resource;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-700/50 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>AI Top Resource Recommendation</span>
          </div>
          <span className="bg-white/10 text-yellow-300 text-xs px-2.5 py-1 rounded-full border border-white/10 font-bold">
            Feature 42
          </span>
        </div>

        {resource ? (
          <>
            <h3 className="text-lg font-extrabold tracking-tight text-white mb-1 leading-tight line-clamp-2">
              {resource.title}
            </h3>
            <p className="text-xs text-indigo-200 mb-3 line-clamp-2">{resource.description}</p>
            <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-[11px] text-yellow-200 mb-4">
              💡 {topRec.reason?.primaryReason}
            </div>
          </>
        ) : (
          <p className="text-xs text-indigo-200 mb-4">Explore verified NCERT and curriculum-aligned learning materials.</p>
        )}
      </div>

      <Link
        to="/resources"
        className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
      >
        <span>Browse Personalized Catalog</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
