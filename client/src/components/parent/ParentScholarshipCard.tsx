import React from 'react';
import { Card } from '../Card';
import { Award, ExternalLink } from 'lucide-react';

interface ParentScholarshipCardProps {
  opportunitiesCount: number;
}

export const ParentScholarshipCard: React.FC<ParentScholarshipCardProps> = ({ opportunitiesCount }) => {
  return (
    <Card title="Scholarship Opportunities" subtitle="Verified financial support opportunities matching your child">
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-950 text-sm">
              {opportunitiesCount} Matching Opportunities Available
            </h4>
            <p className="text-emerald-800 text-[11px]">
              Based on official government and published organization criteria.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
