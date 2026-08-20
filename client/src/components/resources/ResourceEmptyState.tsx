import React from 'react';
import { BookOpen } from 'lucide-react';

export const ResourceEmptyState: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center max-w-md mx-auto my-8">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-extrabold text-gray-900 mb-1">No Verified Resources Found</h3>
      <p className="text-xs text-gray-500">
        No verified resources match the selected search filters. Try adjusting your subject or topic filters.
      </p>
    </div>
  );
};
