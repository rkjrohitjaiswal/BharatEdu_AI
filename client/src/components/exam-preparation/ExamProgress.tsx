import React from 'react';

interface ExamProgressProps {
  conceptMasteryPct: number;
  topicCoveragePct: number;
  practiceAccuracyPct: number;
  mockPerformancePct: number;
}

export const ExamProgress: React.FC<ExamProgressProps> = ({
  conceptMasteryPct,
  topicCoveragePct,
  practiceAccuracyPct,
  mockPerformancePct,
}) => {
  const metrics = [
    { label: 'Concept Mastery', value: conceptMasteryPct, color: 'bg-indigo-500' },
    { label: 'Syllabus Coverage', value: topicCoveragePct, color: 'bg-blue-500' },
    { label: 'Practice Accuracy', value: practiceAccuracyPct, color: 'bg-teal-500' },
    { label: 'Mock Exam Avg', value: mockPerformancePct, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Preparation Progress Matrix</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="text-xs text-gray-500 font-medium">{m.label}</div>
            <div className="text-xl font-extrabold text-gray-900 mt-1">{m.value}%</div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
