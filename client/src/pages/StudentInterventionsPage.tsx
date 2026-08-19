import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { SkeletonLoader } from '../components/SkeletonLoader';
import {
  fetchStudentInterventions,
  updateStudentInterventionStatus,
} from '../services/api';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  Bot,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentInterventionsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [interventions, setInterventions] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchStudentInterventions();
    if (res.success && res.data) {
      setInterventions(res.data);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, nextStatus: 'in_progress' | 'completed') => {
    const res = await updateStudentInterventionStatus(id, nextStatus);
    if (res.success) {
      loadData();
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'critical':
        return <Badge variant="amber">Critical</Badge>;
      case 'high':
        return <Badge variant="amber">High</Badge>;
      case 'medium':
        return <Badge variant="purple">Medium</Badge>;
      default:
        return <Badge variant="slate">Low</Badge>;
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Remediation Assignments"
        description="View and complete targeted learning assignments recommended directly by your teacher."
        badge={<Badge variant="amber">Assigned Tasks</Badge>}
      />

      {interventions.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-xs text-slate-500 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-800 text-sm">No Active Teacher Assignments</p>
            <p className="text-slate-400">You have no pending remediation tasks from your teacher right now.</p>
            <Link to="/practice">
              <Button size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />}>
                Continue Adaptive Practice
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {interventions.map((item) => {
            const teacherName = typeof item.teacherId === 'object' && item.teacherId !== null ? item.teacherId.name : 'Teacher';
            const topicName = typeof item.topicId === 'object' && item.topicId !== null ? item.topicId.name : '';
            const isCompleted = item.status === 'completed';

            return (
              <Card key={item._id || item.id}>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        {getPriorityBadge(item.priority)}
                        {isCompleted ? (
                          <Badge variant="emerald">Completed</Badge>
                        ) : item.status === 'in_progress' ? (
                          <Badge variant="blue">In Progress</Badge>
                        ) : (
                          <Badge variant="amber">Assigned</Badge>
                        )}
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        Assigned by <strong className="text-slate-800">{teacherName}</strong>
                        {topicName && ` • Topic: ${topicName}`}
                      </p>
                    </div>
                    {item.dueDate && (
                      <span className="text-slate-400 text-[11px] shrink-0">
                        Due: {new Date(item.dueDate).toLocaleDateString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl space-y-1">
                    <span className="font-bold text-purple-900">Instructions:</span>
                    <p className="text-slate-800">{item.instructions}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
                    {!isCompleted && item.status === 'assigned' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(item._id || item.id, 'in_progress')}
                      >
                        Start Assignment
                      </Button>
                    )}

                    {!isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(item._id || item.id, 'completed')}
                        icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      >
                        Mark Completed
                      </Button>
                    )}

                    <Link to={item.type === 'tutor' ? '/tutor' : '/practice'}>
                      <Button size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                        {item.type === 'tutor' ? 'Ask AI Tutor' : 'Start Practice'}
                      </Button>
                    </Link>
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
