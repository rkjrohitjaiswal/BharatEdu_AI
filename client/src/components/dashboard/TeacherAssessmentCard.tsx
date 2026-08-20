import React from 'react';
import { Award, ArrowRight, CheckCircle2, FileText, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeacherAssessmentCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900/80 border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-300">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Teacher Assessment Platform</h3>
            <p className="text-xs text-slate-400">Assignments, Rubric Grading & AI Feedback</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-md">
          Assistive AI
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-1">
        <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-center">
          <FileText className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <div className="text-xs font-semibold text-slate-200">Rubric Engine</div>
          <div className="text-[10px] text-slate-400">Structured Criteria</div>
        </div>
        <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-center">
          <Sparkles className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
          <div className="text-xs font-semibold text-slate-200">AI Evaluation</div>
          <div className="text-[10px] text-slate-400">Proposed Evidence</div>
        </div>
        <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-center">
          <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <div className="text-xs font-semibold text-slate-200">Teacher Final</div>
          <div className="text-[10px] text-slate-400">Authoritative Grade</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <button
          onClick={() => navigate('/teacher/assessments')}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
        >
          <span>Manage Teacher Assessments</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TeacherAssessmentCard;
