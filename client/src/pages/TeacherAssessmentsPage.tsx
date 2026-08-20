import React, { useEffect, useState } from 'react';
import { Award, Plus, FileText, CheckCircle2, ArrowRight, BarChart2, Eye, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchTeacherAssessments, publishTeacherAssessment } from '../services/api';
import { IAssessmentClient } from '../types/assessment';

export const TeacherAssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<IAssessmentClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchTeacherAssessments();
    if (res.success && res.data) {
      setAssessments(res.data);
    }
    setLoading(false);
  };

  const handlePublish = async (assessmentId: string) => {
    const res = await publishTeacherAssessment(assessmentId);
    if (res.success) {
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-400" />
              Teacher Assessments & Rubric Grading
            </h1>
            <p className="text-slate-400 text-sm mt-1">Create assignments, inspect student submissions, and review AI proposed evaluations.</p>
          </div>
          <button
            onClick={() => navigate('/teacher/assessments/create')}
            className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assessment</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-slate-400 animate-pulse">
            Loading teacher assessments...
          </div>
        ) : assessments.length === 0 ? (
          <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center space-y-4">
            <p className="text-slate-400">No assessments created yet. Click "Create Assessment" to build your first test or assignment.</p>
            <button
              onClick={() => navigate('/teacher/assessments/create')}
              className="py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl"
            >
              Create Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map((asm) => (
              <div key={asm.assessmentId} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      asm.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {asm.status}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{asm.title}</h3>
                    <p className="text-xs text-slate-400">{asm.subject} • {asm.classLevel} • {asm.board}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-purple-400">{asm.totalMarks} Marks</div>
                    <div className="text-xs text-slate-400">{asm.questionCount} Questions</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  {asm.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(asm.assessmentId)}
                      className="py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-xl"
                    >
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/teacher/assessments/${asm.assessmentId}/analytics`)}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssessmentsPage;
