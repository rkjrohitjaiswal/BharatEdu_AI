import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchExamPapers,
  generateExamReadinessPaper,
  generateMockExam,
  generatePracticePaper,
  generateWeakAreaPaper,
} from '../services/api';
import { IExamPaper } from '../types/exam-paper';

export const ExamPaperPage: React.FC = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState<IExamPaper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    setLoading(true);
    const res = await fetchExamPapers();
    if (res.success && res.data) {
      setPapers(res.data);
    }
    setLoading(false);
  };

  const handleCreateMock = async (type: 'full' | 'practice' | 'weak' | 'readiness') => {
    setGenerating(true);
    let res: any;
    if (type === 'full') res = await generateMockExam('Mathematics');
    else if (type === 'practice') res = await generatePracticePaper();
    else if (type === 'weak') res = await generateWeakAreaPaper();
    else res = await generateExamReadinessPaper();

    setGenerating(false);
    if (res.success && res.data) {
      navigate(`/exam-papers/${res.data.id || res.data.paperId}/run`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 via-red-800 to-rose-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block px-3 py-1 bg-red-500/30 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Feature 30 • Syllabus-Aware & Board-Style
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
            AI Exam Paper Generator & Realistic Mock Engine
          </h1>
          <p className="text-red-100 text-base">
            Generate realistic board-style exam papers with section blueprints, question distributions, timed exam rules, and negative marking.
          </p>
        </div>
      </div>

      {/* Generator Options */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => handleCreateMock('full')}
          disabled={generating}
          className="p-5 bg-white border border-red-200 rounded-xl hover:border-red-500 hover:shadow-md transition-all text-left group"
        >
          <div className="p-3 bg-red-50 text-red-600 rounded-lg w-fit font-bold text-lg mb-3 group-hover:scale-110 transition-transform">
            🎯
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">Full-Length Mock</h3>
          <p className="text-xs text-gray-500 mb-3">90 Mins • 80 Marks • Full Board Blueprint</p>
          <span className="text-xs font-bold text-red-600 group-hover:underline">Generate & Start →</span>
        </button>

        <button
          onClick={() => handleCreateMock('practice')}
          disabled={generating}
          className="p-5 bg-white border border-blue-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left group"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg w-fit font-bold text-lg mb-3 group-hover:scale-110 transition-transform">
            📘
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">Practice Paper</h3>
          <p className="text-xs text-gray-500 mb-3">60 Mins • 50 Marks • Sectional Practice</p>
          <span className="text-xs font-bold text-blue-600 group-hover:underline">Generate & Start →</span>
        </button>

        <button
          onClick={() => handleCreateMock('weak')}
          disabled={generating}
          className="p-5 bg-white border border-amber-200 rounded-xl hover:border-amber-500 hover:shadow-md transition-all text-left group"
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg w-fit font-bold text-lg mb-3 group-hover:scale-110 transition-transform">
            ⚡
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">Weak Area Remediation</h3>
          <p className="text-xs text-gray-500 mb-3">Targeted Weak Topics & Repeat Mistakes</p>
          <span className="text-xs font-bold text-amber-600 group-hover:underline">Generate & Start →</span>
        </button>

        <button
          onClick={() => handleCreateMock('readiness')}
          disabled={generating}
          className="p-5 bg-white border border-emerald-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all text-left group"
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg w-fit font-bold text-lg mb-3 group-hover:scale-110 transition-transform">
            🏆
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">Exam Readiness Benchmark</h3>
          <p className="text-xs text-gray-500 mb-3">Final Exam Simulation & Readiness Test</p>
          <span className="text-xs font-bold text-emerald-600 group-hover:underline">Generate & Start →</span>
        </button>
      </div>

      {/* Papers List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Your Generated Mock Exam Papers</h2>
          <span className="text-xs font-semibold text-gray-400">{papers.length} Papers Total</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading mock exam papers...</div>
        ) : papers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No mock exam papers found. Click one of the generator options above to start your first exam!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {papers.map((paper) => (
              <div key={paper.id || paper.paperId} className="p-6 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded">
                      {paper.examType.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">{paper.board} • {paper.classLevel}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{paper.title}</h3>
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span>Duration: <strong>{paper.durationMinutes} mins</strong></span>
                    <span>Total Marks: <strong>{paper.totalMarks}</strong></span>
                    <span>Questions: <strong>{paper.questionCount}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {paper.status === 'completed' ? (
                    <>
                      <button
                        onClick={() => navigate(`/exam-papers/${paper.id || paper.paperId}/results`)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold rounded-lg transition-colors"
                      >
                        View Score
                      </button>
                      <button
                        onClick={() => navigate(`/exam-papers/${paper.id || paper.paperId}/review`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-semibold rounded-lg transition-colors"
                      >
                        Answer Review
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => navigate(`/exam-papers/${paper.id || paper.paperId}/run`)}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      {paper.status === 'in_progress' ? 'Resume Exam' : 'Start Exam'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
