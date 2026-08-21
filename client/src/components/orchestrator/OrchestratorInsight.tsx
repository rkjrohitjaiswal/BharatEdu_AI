import React from 'react';
import { IOrchestrationInsightClient } from '../../types/learning-orchestrator';
import { Sparkles, AlertCircle, Award } from 'lucide-react';

interface OrchestratorInsightProps {
  insight: IOrchestrationInsightClient;
}

export const OrchestratorInsight: React.FC<OrchestratorInsightProps> = ({ insight }) => {
  return (
    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl mb-8 border border-purple-500/30">
      <div className="flex items-center space-x-2 text-yellow-300 font-bold text-xs uppercase mb-2">
        <Sparkles className="w-4 h-4" />
        <span>AI Orchestrator Strategy Insight</span>
      </div>

      <h3 className="text-lg font-extrabold mb-2">{insight.headline}</h3>
      <p className="text-xs text-indigo-100 mb-4">{insight.explanation}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
        <div>
          <div className="font-bold text-yellow-300 mb-1 flex items-center space-x-1">
            <Award className="w-3.5 h-3.5" />
            <span>Recommended Core Action:</span>
          </div>
          <div className="text-gray-200">{insight.keyActionRecommendation}</div>
        </div>

        {insight.prerequisiteAlert && (
          <div>
            <div className="font-bold text-red-300 mb-1 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Prerequisite Alert:</span>
            </div>
            <div className="text-gray-200">{insight.prerequisiteAlert}</div>
          </div>
        )}
      </div>
    </div>
  );
};
