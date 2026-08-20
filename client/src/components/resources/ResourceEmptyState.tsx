import React from 'react';
import { BookOpen } from 'lucide-react';

export const ResourceEmptyState: React.FC = () => {
  return (
    <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-3 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
        <BookOpen className="w-6 h-6" />
      </div>
      <h3 className="font-extrabold text-base text-slate-900">No Matching Resources</h3>
      <p className="text-xs text-slate-500 font-medium">
        Try adjusting your search query or subject filters to discover relevant learning materials.
      </p>
    </div>
  );
};
