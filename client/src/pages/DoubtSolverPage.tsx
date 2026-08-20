import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDoubts, solveDoubt } from '../services/api';
import { IStudentDoubtClient } from '../types/doubt-solver';

export const DoubtSolverPage: React.FC = () => {
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState<IStudentDoubtClient[]>([]);
  const [questionInput, setQuestionInput] = useState<string>('');
  const [subject, setSubject] = useState<string>('Mathematics');
  const [level, setLevel] = useState<string>('standard');
  const [language, setLanguage] = useState<string>('en');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadDoubts();
  }, []);

  const loadDoubts = async () => {
    setLoading(true);
    const res = await fetchDoubts();
    if (res.success && res.data) {
      setDoubts(res.data);
    }
    setLoading(false);
  };

  const handleAskDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    setSubmitting(true);
    const res = await solveDoubt({
      question: questionInput.trim(),
      subject,
      level,
      language,
    });
    setSubmitting(false);
    if (res.success && res.data) {
      setQuestionInput('');
      navigate(`/doubts/${res.data.id || res.data.doubtId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-800 to-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block px-3 py-1 bg-indigo-500/30 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Feature 32 • Grounded Step-by-Step AI Learning Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
            AI Doubt Solver & Step-by-Step Explainer
          </h1>
          <p className="text-indigo-100 text-base">
            Ask any academic question and receive grounded, step-by-step explanations personalized to your mastery, preferred level, and language (English, Hindi, Gujarati).
          </p>
        </div>
      </div>

      {/* Ask Doubt Form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Ask an Academic Doubt</h2>
        <form onSubmit={handleAskDoubt} className="space-y-4">
          <textarea
            rows={3}
            placeholder="Type your question or problem statement clearly (e.g. Explain how to solve linear equations in two variables)..."
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Explanation Depth</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="beginner">Beginner (Simple Concept)</option>
                <option value="standard">Standard (4-Step Solution)</option>
                <option value="advanced">Advanced (Deep Rigorous)</option>
                <option value="exam_focused">Exam Focused (Board Step Marks)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="gu">Gujarati (ગુજરાતી)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !questionInput.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg shadow-sm transition-colors"
            >
              {submitting ? 'Solving Step-by-Step...' : 'Solve AI Doubt →'}
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Your Asked Doubts History</h2>
          <span className="text-xs font-semibold text-gray-400">{doubts.length} Doubts Recorded</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading doubt history...</div>
        ) : doubts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No doubt history yet. Ask a question above!</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {doubts.map((item) => (
              <div key={item.id || item.doubtId} className="p-6 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded">
                      {item.subject}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">"{item.question}"</h3>
                  <p className="text-xs text-gray-500">Topic: {item.topicId} | Status: <span className="text-green-600 font-semibold">{item.status.toUpperCase()}</span></p>
                </div>

                <button
                  onClick={() => navigate(`/doubts/${item.id || item.doubtId}`)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg transition-colors"
                >
                  View Solution →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
