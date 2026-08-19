import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { ScholarshipMatchItem, Scholarship } from '../../types';
import { Award, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ScholarshipPreviewProps {
  matches: ScholarshipMatchItem[];
}

export const ScholarshipPreview: React.FC<ScholarshipPreviewProps> = ({ matches }) => {
  return (
    <Card
      title="Opportunities for You"
      subtitle="Financial support & scholarship matches"
      action={
        <Link to="/scholarships">
          <Button size="sm" variant="ghost" icon={<ArrowRight className="w-3.5 h-3.5" />}>
            View All
          </Button>
        </Link>
      }
    >
      {matches.length === 0 ? (
        <div className="space-y-3 text-xs">
          <p className="text-slate-600">
            Explore official government scholarships, stipends, and educational grants for students.
          </p>
          <div className="pt-2">
            <Link to="/scholarships">
              <Button size="sm" variant="outline" icon={<Award className="w-3.5 h-3.5" />}>
                Browse Scholarship Schemes
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-xs">
          {matches.map((match) => {
            const sch = typeof match.scholarshipId === 'object' ? (match.scholarshipId as Scholarship) : null;
            if (!sch) return null;

            return (
              <div key={match._id} className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-900 leading-snug">{sch.name}</h4>
                  <Badge variant="emerald">{match.matchScore}% Match</Badge>
                </div>
                <p className="text-slate-500 text-[11px]">{sch.provider}</p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
