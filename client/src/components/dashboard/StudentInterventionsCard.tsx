import React, { useEffect, useState } from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { fetchStudentInterventions } from '../../services/api';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentInterventionsCard: React.FC = () => {
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStudentInterventions({ status: 'assigned' }).then((res) => {
      if (res.success && res.data) {
        setInterventions(res.data);
      }
      setLoading(false);
    });
  }, []);

  const activeCount = interventions.filter((i) => i.status !== 'completed').length;

  return (
    <Card
      title="Teacher Assignments"
      subtitle="Remediation tasks assigned by your teacher"
      action={
        activeCount > 0 ? (
          <Link to="/interventions">
            <Button size="sm" variant="outline" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All ({activeCount})
            </Button>
          </Link>
        ) : undefined
      }
    >
      {loading ? (
        <div className="py-4 text-center text-xs text-slate-400">Loading assignments...</div>
      ) : activeCount === 0 ? (
        <div className="text-center py-6 text-xs text-emerald-600 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="font-semibold text-slate-900">Zero Pending Teacher Tasks!</p>
          <p className="text-slate-500">You are up to date on all teacher-assigned remediation tasks.</p>
        </div>
      ) : (
        <div className="space-y-2.5 text-xs">
          {interventions.slice(0, 2).map((item) => (
            <div
              key={item._id || item.id}
              className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1.5"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-900">{item.title}</span>
                <Badge variant="purple" size="sm">{item.priority}</Badge>
              </div>

              <p className="text-slate-700 text-[11px] font-medium">{item.instructions}</p>

              <div className="flex justify-between items-center pt-1 text-[11px]">
                <span className="text-slate-500">Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-IN') : 'Soon'}</span>
                <Link to="/interventions" className="text-purple-700 font-bold hover:underline flex items-center gap-0.5">
                  Start Task <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
