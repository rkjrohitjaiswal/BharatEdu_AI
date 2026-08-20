import React from 'react';
import { BookOpen } from 'lucide-react';

export const ResourceEmptyState: React.FC = () => {
  return (
    <div className="p-12 bg-slate-900/40 border border-slate-800 rounded-3xl text-center space-y-4">
      <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
      <h3 className="text-lg font-bold text-white">No Matching Resources Found</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">
        Try adjusting your filter options or search term to discover verified educational resources.
      </p>
    </div>
  );
};

export default ResourceEmptyState;
