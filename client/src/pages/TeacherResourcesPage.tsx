import React, { useEffect, useState } from 'react';
import { fetchTeacherResourceList } from '../services/api';
import { BookOpen, CheckCircle2, Share2 } from 'lucide-react';

export const TeacherResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    const res = await fetchTeacherResourceList();
    if (res.success && res.data) {
      setResources(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading Teacher Resource Management Portal...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-extrabold">Teacher Verified Resource Management</h1>
        <p className="text-xs text-blue-200 mt-1">Browse, assign, and track NCERT curriculum-aligned learning materials for your class.</p>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Verified Curriculum Catalog</h3>
        <div className="space-y-3">
          {resources.map((res, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900 text-sm">{res.title}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>
                <div className="text-gray-500 mt-1">{res.subject} • {res.topic} • Class {res.classLevel} ({res.board})</div>
              </div>

              <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center space-x-1 shadow-sm">
                <Share2 className="w-3.5 h-3.5" />
                <span>Recommend to Class</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
