import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { TeacherInterventionModal } from '../components/teacher/TeacherInterventionModal';
import {
  fetchTeacherInterventions,
  fetchTeacherInterventionAnalytics,
  fetchTeacherStudents,
} from '../services/api';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  BarChart3,
  UserCheck,
  Send,
} from 'lucide-react';

export const TeacherInterventionsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);

  // Filter States
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');

  // Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, [selectedStatus, selectedPriority]);

  const loadData = async () => {
    setLoading(true);
    const [listRes, anaRes, stdRes] = await Promise.all([
      fetchTeacherInterventions({ status: selectedStatus || undefined, priority: selectedPriority || undefined }),
      fetchTeacherInterventionAnalytics(),
      fetchTeacherStudents(),
    ]);

    if (listRes.success && listRes.data) setInterventions(listRes.data);
    if (anaRes.success && anaRes.data) setAnalytics(anaRes.data);
    if (stdRes.success && stdRes.data) setStudents(stdRes.data);
    setLoading(false);
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

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'completed':
        return <Badge variant="emerald">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="blue">In Progress</Badge>;
      case 'cancelled':
        return <Badge variant="slate">Cancelled</Badge>;
      default:
        return <Badge variant="amber">Assigned</Badge>;
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Interventions & Remediation"
        description="Assign targeted learning tasks, monitor remediation progress, and close the teacher-to-student feedback loop."
        badge={<Badge variant="purple">Remediation Portal</Badge>}
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Assign New Remediation
          </Button>
        }
      />

      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Total Assigned</span>
              <Send className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{analytics.totalAssigned}</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>In Progress</span>
              <Clock className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-2xl font-bold text-sky-700">{analytics.inProgress}</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">{analytics.completed}</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Overdue</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-700">{analytics.overdue}</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Completion Rate</span>
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900">{analytics.completionRate}%</p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <Card>
        <div className="flex justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-3">
            <label className="font-bold text-slate-700">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">All Statuses</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <label className="font-bold text-slate-700 ml-2">Priority:</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <span className="text-slate-500">{interventions.length} assignments found</span>
        </div>
      </Card>

      {/* Interventions List */}
      {interventions.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-xs text-slate-500 space-y-3">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-800 text-sm">No Active Interventions Found</p>
            <p className="text-slate-400">You haven't assigned any remediation tasks matching these filters.</p>
            <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setModalOpen(true)}>
              Assign First Remediation
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {interventions.map((item) => {
            const studentName = typeof item.studentId === 'object' && item.studentId !== null ? item.studentId.name : 'Assigned Student';
            const topicName = typeof item.topicId === 'object' && item.topicId !== null ? item.topicId.name : '';

            return (
              <div
                key={item._id || item.id}
                className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      {getPriorityBadge(item.priority)}
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      Target Student: <strong className="text-slate-800">{studentName}</strong>
                      {topicName && ` • Topic: ${topicName}`}
                    </p>
                  </div>
                  {item.dueDate && (
                    <span className="text-slate-400 text-[11px] shrink-0">
                      Due: {new Date(item.dueDate).toLocaleDateString('en-IN')}
                    </span>
                  )}
                </div>

                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{item.instructions}</p>

                {item.teacherNote && (
                  <p className="text-purple-700 text-[11px] italic">Note: {item.teacherNote}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Modal */}
      {students.length > 0 && (
        <TeacherInterventionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAssigned={loadData}
          prefillData={{
            studentId: students[0]._id || students[0].id,
            studentName: students[0].name,
          }}
        />
      )}
    </div>
  );
};
