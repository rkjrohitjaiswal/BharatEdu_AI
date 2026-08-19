import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Users, AlertTriangle, TrendingUp, GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchTeacherClasses, fetchTeacherAnalyticsOverview } from '../services/api';
import { TeacherClassItem, TeacherAnalyticsOverview } from '../types';

export const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<TeacherClassItem[]>([]);
  const [overview, setOverview] = useState<TeacherAnalyticsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([fetchTeacherClasses(), fetchTeacherAnalyticsOverview()]).then(([clsRes, ovRes]) => {
      if (clsRes.success && clsRes.data) setClasses(clsRes.data);
      if (ovRes.success && ovRes.data) setOverview(ovRes.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name || 'Teacher'}`}
        description="Teacher overview and class management portal."
        badge={<Badge variant="purple">Teacher Portal</Badge>}
        actions={
          <div className="flex gap-2">
            <Link to="/teacher/interventions">
              <Button size="sm" variant="outline">Remediation Portal</Button>
            </Link>
            <Link to="/teacher/analytics">
              <Button size="sm" icon={<TrendingUp className="w-4 h-4" />}>Class Analytics</Button>
            </Link>
          </div>
        }
      />

      {/* Teacher Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Assigned Classes</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {overview ? overview.totalClasses : classes.length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Active Student Gaps</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {overview ? overview.totalActiveGaps : 0}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Class Roster Status</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {classes.length > 0 ? 'Active' : 'Unassigned'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Assigned Classes Roster" subtitle="Classroom section management">
          {classes.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No Assigned Classes Yet</p>
              <p className="text-slate-400">Class rosters assigned by school administrators will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {classes.map((c) => (
                <div key={c._id} className="p-3 border border-slate-100 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">{c.name} - Section {c.section}</p>
                    <p className="text-slate-400">Academic Year: {c.academicYear}</p>
                  </div>
                  <Badge variant="blue">Grade {c.classLevel}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Classroom Analytics" subtitle="Class-wide concept hurdles & trends">
          <p className="text-xs text-slate-500 mb-4">
            Analyze aggregate class performance metrics as students complete adaptive practice modules.
          </p>
          <Link to="/teacher/analytics">
            <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Analytics Portal
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};
