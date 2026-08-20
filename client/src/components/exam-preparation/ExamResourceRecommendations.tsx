import React from 'react';
import { BookOpenCheck, ExternalLink } from 'lucide-react';

interface ExamResourceRecommendationsProps {
  resources: Array<{ resourceId: string; title: string; type: string; officialSourceUrl?: string; publisher?: string }>;
}

export const ExamResourceRecommendations: React.FC<ExamResourceRecommendationsProps> = ({ resources }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpenCheck className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Grounded Official Study Resources</h3>
      </div>

      <div className="space-y-3">
        {resources.map((res, idx) => (
          <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-gray-900">{res.title}</span>
              <div className="text-[10px] text-gray-500 mt-0.5">{res.publisher || 'Verified Official Material'} • {res.type}</div>
            </div>
            {res.officialSourceUrl && (
              <a
                href={res.officialSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-white text-indigo-600 font-bold border border-indigo-200 rounded-lg hover:bg-indigo-50 flex items-center space-x-1"
              >
                <span>View Resource</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
