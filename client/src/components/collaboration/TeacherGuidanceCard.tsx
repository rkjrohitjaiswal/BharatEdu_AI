import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeacherGuidanceCard: React.FC = () => {
  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-400" />
          Teacher Guidance & Task
        </h4>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">Active Task</span>
      </div>

      <p className="text-xs text-slate-300">
        Assigned: Practice module on Fractions & Rational Expressions.
      </p>

      <Link
        to="/collaboration"
        className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 pt-1"
      >
        <span>View Guidance & Tasks</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default TeacherGuidanceCard;
