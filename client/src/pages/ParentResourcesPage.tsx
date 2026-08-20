import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchParentChildResourceList } from '../services/api';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ShieldCheck } from 'lucide-react';

export const ParentResourcesPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [ranking, setRanking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) loadChildResources();
  }, [studentId]);

  const loadChildResources = async () => {
    setLoading(true);
    const res = await fetchParentChildResourceList(studentId || 'student_1');
    if (res.success && res.data) {
      setRanking(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading Child Recommended Resources...</span>
      </div>
    );
  }

  const recommendations = ranking?.recommendations || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-teal-900 via-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Parent Portal Access • Verified Student Link</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold">Child Personalized Learning Content</h1>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Recommended Resources For Your Child</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec: any, idx: number) => (
            <ResourceCard
              key={idx}
              resource={rec.resource}
              recommendationScore={rec.recommendationScore}
              reason={rec.reason.primaryReason}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
