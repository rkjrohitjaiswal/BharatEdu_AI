import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { AlertCircle, Target } from 'lucide-react';

interface ExamPriorityTopicsProps {
  criticalTopics: any[];
  highPriorityTopics: any[];
}

export const ExamPriorityTopics: React.FC<ExamPriorityTopicsProps> = ({
  criticalTopics,
  highPriorityTopics,
}) => {
  const combined = [...(criticalTopics || []), ...(highPriorityTopics || [])];

  return (
    <Card title="High-Risk & Priority Topics" subtitle="Topics requiring urgent review before exam day">
      <div className="space-y-3 text-xs">
        {combined.length === 0 ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center">
            🎉 Great job! No critical or high-risk topics detected. Maintain your revision pace!
          </div>
        ) : (
          combined.map((topic, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border space-y-1.5 ${
                topic.priority === 'critical'
                  ? 'bg-red-50/70 border-red-200'
                  : 'bg-amber-50/70 border-amber-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertCircle
                    className={`w-4 h-4 ${
                      topic.priority === 'critical' ? 'text-red-600' : 'text-amber-600'
                    }`}
                  />
                  {topic.topicName} ({topic.subjectName})
                </span>
                <Badge variant={topic.priority === 'critical' ? 'red' : 'amber'}>
                  {topic.priority.toUpperCase()}
                </Badge>
              </div>

              <p className="text-slate-600 text-[11px] font-medium">{topic.reason}</p>

              <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
                <span>Mastery: {topic.masteryScore}%</span>
                <span>Level: {topic.readinessLevel}</span>
                {topic.recentMistakesCount > 0 && (
                  <span className="text-red-600 font-bold">{topic.recentMistakesCount} recent mistake(s)</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
