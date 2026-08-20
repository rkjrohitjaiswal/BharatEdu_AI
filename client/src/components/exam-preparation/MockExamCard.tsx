import React from 'react';
import { FileCheck, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MockExamCardProps {
  mockType: string;
  targetTopics: string[];
  durationMinutes: number;
  totalQuestions: number;
  reason: string;
  onStartMock?: () => void;
}

export const MockExamCard: React.FC<MockExamCardProps> = ({
  mockType,
  targetTopics,
  durationMinutes,
  totalQuestions,
  reason,
  onStartMock,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-5 shadow-md mb-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-indigo-200">Recommended Mock Exam</div>
            <h4 className="text-lg font-extrabold capitalize">{mockType.replace(/_/g, ' ')} Simulation</h4>
          </div>
        </div>

        <button
          onClick={onStartMock || (() => navigate('/assessments'))}
          className="px-4 py-2 bg-white text-indigo-700 font-bold text-xs rounded-xl shadow hover:bg-indigo-50 flex items-center space-x-1.5"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Attempt Mock Now</span>
        </button>
      </div>

      <p className="text-xs text-indigo-100 mt-3">{reason}</p>

      <div className="flex items-center space-x-6 text-xs text-indigo-200 mt-4 pt-3 border-t border-white/20">
        <span>⏱️ Duration: {durationMinutes} mins</span>
        <span>📝 Questions: {totalQuestions}</span>
        <span>🎯 Topics: {targetTopics.join(', ')}</span>
      </div>
    </div>
  );
};
