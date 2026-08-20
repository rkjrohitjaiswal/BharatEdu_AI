import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export const ResourceHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-xl mb-6 border border-blue-700/50">
      <div className="flex justify-between items-start md:items-center">
        <div>
          <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>AI Verified Learning Catalog</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Personalized Content & Resources</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            Curriculum-aligned NCERT and verified learning material tailored to your active learning gaps, exam prep, and revision needs.
          </p>
        </div>
        <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 hidden md:block">
          <BookOpen className="w-8 h-8 text-blue-300" />
        </div>
      </div>
    </div>
  );
};
