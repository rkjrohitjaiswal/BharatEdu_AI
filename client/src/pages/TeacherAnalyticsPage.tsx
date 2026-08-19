import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { fetchTeacherClasses, fetchTeacherAnalyticsOverview, fetchTeacherStudents } from '../services/api';
import { TeacherClassItem, TeacherAnalyticsOverview } from '../types';
import { Users, AlertTriangle, GraduationCap } from 'lucide-react';

export const TeacherAnalyticsPage: React.FC = () => {
  const [classes, setClasses] = useState<TeacherClassItem[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [overview, setOverview] = useState<TeacherAnalyticsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([fetchTeacherClasses(), fetchTeacherAnalyticsOverview(), fetchTeacherStudents()]).then(
      ([clsRes, ovRes, stdRes]) => {
        if (clsRes.success && clsRes.data) setClasses(clsRes.data);
        if (ovRes.success && ovRes.data) setOverview(ovRes.data);
        if (stdRes.success && stdRes.data) setStudents(stdRes.data);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  const activeGapsCount = overview?.totalActiveGaps || 0;
  const totalStudents = students.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Analytics & Insights"
        description="Aggregate performance analytics, class rosters, and active gap alerts."
        badge={<Badge variant="blue">Analytics Engine</Badge>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Assigned Classrooms Overview" subtitle="Authorized classroom rosters">
          {classes.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 space-y-2">
              <GraduationCap className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No Classes Assigned</p>
              <p className="text-slate-400">Class rosters assigned by school administrators will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {classes.map((cls) => (
                <div key={cls._id} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{cls.name} (Section {cls.section})</h4>
                    <p className="text-slate-500 text-[11px]">Academic Year: {cls.academicYear}</p>
                  </div>
                  <Badge variant="emerald" size="sm">Grade {cls.classLevel}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Classroom Learning Gap Summary" subtitle="Active gap counts across assigned classes">
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Active Learning Gaps</span>
                </div>
                <Badge variant="amber" size="sm">{activeGapsCount} Total</Badge>
              </div>
              <p className="text-amber-800 text-[11px]">
                {activeGapsCount > 0
                  ? `${activeGapsCount} active conceptual gaps require teacher intervention across your assigned classes.`
                  : 'Zero active gaps detected across authorized student rosters.'}
              </p>
            </div>

            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between font-bold text-sky-900">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-600" />
                  <span>Enrolled Students</span>
                </div>
                <Badge variant="blue" size="sm">{totalStudents} Enrolled</Badge>
              </div>
              <p className="text-sky-800 text-[11px]">
                {totalStudents > 0
                  ? `Monitoring performance metrics for ${totalStudents} enrolled students.`
                  : 'Enrolled student analytics will populate as students complete practice modules.'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
