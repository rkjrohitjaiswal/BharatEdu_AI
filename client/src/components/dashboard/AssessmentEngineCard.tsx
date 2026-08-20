import React, { useEffect, useState } from 'react';
import { fetchStudentAssessmentEngineList } from '../../services/api';
import { IAssessmentClient } from '../../types/assessment-engine';
import { Award, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AssessmentEngineCard: React.FC = () => {
  const [assessments, setAssessments] = useState<IAssessmentClient[]>([]);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    const res = await fetchStudentAssessmentEngineList();
    if (res.success && res.data) {
      setAssessments(res.data.slice(0, 2));
    }
  };

  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Diagnostic Assessments</h3>
            <p className="text-xs text-slate-400">Adaptive curriculum-aligned tests</p>
          </div>
        </div>

        <Link
          to="/assessments"
          className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {assessments.length === 0 ? (
          <p className="text-xs text-slate-400">Loading diagnostic tests...</p>
        ) : (
          assessments.map((a) => (
            <div
              key={a.assessmentId}
              className="p-3.5 bg-slate-950/50 border border-slate-800/80 hover:border-purple-500/40 rounded-2xl space-y-2 text-xs transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate max-w-[200px]">{a.title}</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                  {a.assessmentType}
                </span>
              </div>

              <p className="text-slate-300 text-[11px] line-clamp-1">{a.description}</p>

              <div className="flex items-center justify-between text-slate-400 text-[10px] pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {a.durationMinutes} mins • {a.totalQuestions} Questions
                </span>
                <Link
                  to={`/assessments/${a.assessmentId}`}
                  className="font-bold text-purple-300 hover:underline"
                >
                  Start Assessment →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssessmentEngineCard;
