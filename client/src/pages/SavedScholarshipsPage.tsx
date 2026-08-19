import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { SkeletonLoader } from '../components/SkeletonLoader';
import {
  fetchSavedScholarships,
  unsaveScholarshipOpportunity,
  updateScholarshipApplicationStatus,
} from '../services/api';
import {
  Award,
  ExternalLink,
  Bookmark,
  Trash2,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SavedScholarshipsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [savedItems, setSavedItems] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchSavedScholarships();
    if (res.success && res.data) {
      setSavedItems(res.data);
    }
    setLoading(false);
  };

  const handleUnsave = async (scholarshipId: string) => {
    await unsaveScholarshipOpportunity(scholarshipId);
    loadData();
  };

  const handleStatusChange = async (scholarshipId: string, status: any) => {
    await updateScholarshipApplicationStatus(scholarshipId, status);
    loadData();
  };

  const getDeadlineBadge = (daysRemaining: number | null, status: string) => {
    if (status === 'closed' || (daysRemaining !== null && daysRemaining <= 0)) {
      return <Badge variant="slate">Deadline Passed</Badge>;
    }
    if (daysRemaining === 0) {
      return <Badge variant="amber">Deadline Today!</Badge>;
    }
    if (daysRemaining !== null && daysRemaining <= 7) {
      return <Badge variant="amber">Urgent: {daysRemaining} days left</Badge>;
    }
    if (daysRemaining !== null && daysRemaining <= 30) {
      return <Badge variant="purple">Closing in {daysRemaining} days</Badge>;
    }
    return <Badge variant="emerald">Open Scheme</Badge>;
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-6 text-xs">
      <PageHeader
        title="Saved Scholarships & Application Tracker"
        description="Track deadlines and self-reported application progress for your saved opportunities."
        badge={<Badge variant="purple">Saved Items</Badge>}
        actions={
          <Link to="/scholarships">
            <Button size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              Explore More Scholarships
            </Button>
          </Link>
        }
      />

      {savedItems.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-slate-500 space-y-3">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-800 text-sm">No Saved Scholarships Yet</p>
            <p className="text-slate-400">Save scholarships from the matching portal to track their deadlines here.</p>
            <Link to="/scholarships">
              <Button size="sm">Explore Matched Scholarships</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {savedItems.map((item) => {
            const sch = item.scholarship || item.scholarshipId;
            const schId = sch._id || sch.id;

            return (
              <Card key={item._id || item.id}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-700 uppercase">{sch.provider}</span>
                        {getDeadlineBadge(item.daysRemaining, item.deadlineStatus)}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{sch.name}</h3>
                    </div>

                    <button
                      onClick={() => handleUnsave(schId)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>

                  <p className="text-slate-600">{sch.description}</p>

                  <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-purple-900">Application Tracking:</span>
                      <span className="text-[10px] text-purple-700 italic">Self-reported application status</span>
                    </div>

                    <select
                      value={item.applicationStatus || 'not_started'}
                      onChange={(e) => handleStatusChange(schId, e.target.value)}
                      className="p-2 border border-purple-200 rounded-lg bg-white w-full font-medium"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="planning">Planning Documents</option>
                      <option value="applied">Applied on Official Portal</option>
                      <option value="submitted">Submitted & Acknowledged</option>
                      <option value="closed">Closed / Archived</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                    <span className="text-slate-500 font-medium">
                      {item.daysRemaining !== null
                        ? `Deadline: ${new Date(sch.deadline).toLocaleDateString('en-IN')}`
                        : 'Deadline not verified'}
                    </span>
                    {sch.applicationUrl && (
                      <a
                        href={sch.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold"
                      >
                        <span>Apply Officially</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
