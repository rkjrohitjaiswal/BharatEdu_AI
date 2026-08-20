import React, { useEffect, useState } from 'react';
import { Award, Clock, ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchStudentPublishedAssessments } from '../services/api';
import { IAssessmentClient } from '../types/assessment';

export const StudentAssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<IAssessmentClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchStudentPublishedAssessments();
    if (res.success && res.data) {
      setAssessments(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-400" />
            Teacher Assignments & Tests
          </h1>
          <p className="text-slate-400 text-sm mt-1">Complete published assignments, quizzes, and subjective tests assigned by your teacher.</p>
        </div>

        {loading ? (
          <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-slate-400 animate-pulse">
            Loading assignments...
          </div>
        ) : assessments.length === 0 ? (
          <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-slate-400">
            No active assignments published by your teacher at this moment.
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((asm) => (
              <div key={asm.assessmentId} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-1">
                    {asm.assessmentType} • {asm.subject}
                  </div>
                  <h3 className="text-lg font-bold text-white">{asm.title}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Total Marks: {asm.totalMarks} • Questions: {asm.questionCount}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/student/teacher-assessments/${asm.assessmentId}`)}
                  className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
                >
                  <span>Start Assignment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssessmentsPage;
