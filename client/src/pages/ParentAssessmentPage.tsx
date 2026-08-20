import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchParentChildAssessmentEngineList } from '../services/api';
import { HeartHandshake, Award, BookOpen } from 'lucide-react';

export const ParentAssessmentPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildAssessments(studentId || 'student_1');
  }, [studentId]);

  const loadChildAssessments = async (sId: string) => {
    setLoading(true);
    const res = await fetchParentChildAssessmentEngineList(sId);
    if (res.success && res.data) {
      setAssessments(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading Child Assessment Overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Parent Child Assessment Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Child Assessment Progress & Results</h1>
          <p className="text-xs text-slate-400">View your child's evaluated scores, completed diagnostic tests, and mastery achievements.</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" /> Completed & Active Assessments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assessments.map((a) => (
              <div key={a.assessmentId} className="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                    {a.subject}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                    {a.status}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{a.title}</h4>
                <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">Evaluated Score</span>
                  <span className="text-base font-extrabold text-purple-300">{a.percentage || 0}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentAssessmentPage;
