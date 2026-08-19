import React, { useEffect, useState } from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { fetchUpcomingScholarshipDeadlines } from '../../services/api';
import { Award, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ScholarshipAlertsCard: React.FC = () => {
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUpcomingScholarshipDeadlines(30).then((res) => {
      if (res.success && res.data) {
        setDeadlines(res.data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <Card
      title="Scholarship Deadline Alerts"
      subtitle="Top upcoming verified opportunities"
      action={
        <Link to="/scholarships">
          <Button size="sm" variant="outline" icon={<ArrowRight className="w-3.5 h-3.5" />}>
            View All ({deadlines.length})
          </Button>
        </Link>
      }
    >
      {loading ? (
        <div className="py-4 text-center text-xs text-slate-400">Loading deadline alerts...</div>
      ) : deadlines.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500 space-y-2">
          <Award className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="font-semibold text-slate-900">No Urgent Deadlines Approaching</p>
          <p className="text-slate-400">Explore open government scheme opportunities.</p>
        </div>
      ) : (
        <div className="space-y-2.5 text-xs">
          {deadlines.slice(0, 3).map((item) => {
            const sch = item.scholarship;
            const daysLeft = item.daysRemaining;

            return (
              <div
                key={sch._id || sch.id}
                className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-950 truncate max-w-[180px]">{sch.name}</span>
                  <Badge variant={daysLeft <= 7 ? 'amber' : 'emerald'} size="sm">
                    {daysLeft !== null ? `${daysLeft} days left` : 'Open Scheme'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-600">
                  <span>Match: <strong className="text-emerald-800">{item.matchScore}%</strong></span>
                  <a
                    href={sch.applicationUrl || 'https://scholarships.gov.in'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                  >
                    Apply <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
