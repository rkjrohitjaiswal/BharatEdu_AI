import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDoubtToRevision, fetchDoubt, followupDoubt, practiceDoubtConcept, submitDoubtFeedback } from '../services/api';
import { IStudentDoubtClient } from '../types/doubt-solver';

export const DoubtDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doubt, setDoubt] = useState<IStudentDoubtClient | null>(null);
  const [followupInput, setFollowupInput] = useState<string>('');
  const [actionMsg, setActionMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submittingFollowup, setSubmittingFollowup] = useState<boolean>(false);

  useEffect(() => {
    if (id) loadDetail();
  }, [id]);

  const loadDetail = async () => {
    setLoading(true);
    const res = await fetchDoubt(id!);
    if (res.success && res.data) {
      setDoubt(res.data);
    }
    setLoading(false);
  };

  const handleFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupInput.trim() || !doubt) return;
    setSubmittingFollowup(true);
    const res = await followupDoubt(doubt.id || doubt.doubtId, { question: followupInput.trim() });
    setSubmittingFollowup(false);
    if (res.success) {
      setFollowupInput('');
      loadDetail();
    }
  };

  const handleFeedback = async (helpful: boolean) => {
    if (!doubt || !doubt.response) return;
    const res = await submitDoubtFeedback(doubt.id || doubt.doubtId, {
      responseId: doubt.response.responseId,
      helpful,
    });
    if (res.success) {
      setActionMsg(helpful ? 'Thank you! Marked as helpful.' : 'Thank you for your feedback.');
    }
  };

  const handleAddToRevision = async () => {
    if (!doubt) return;
    const res = await addDoubtToRevision(doubt.id || doubt.doubtId);
    if (res.success && res.data?.message) {
      setActionMsg(res.data.message);
    }
  };

  const handlePractice = async () => {
    if (!doubt) return;
    const res = await practiceDoubtConcept(doubt.id || doubt.doubtId);
    if (res.success && res.data?.message) {
      setActionMsg(res.data.message);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading Doubt Solution & Steps...</div>;
  if (!doubt) return <div className="p-12 text-center text-gray-500">Doubt record not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Question */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 font-bold rounded-full uppercase">
            {doubt.subject} • {doubt.topicId}
          </span>
          <span className="text-gray-400">{new Date(doubt.createdAt).toLocaleString()}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">"{doubt.question}"</h1>
      </div>

      {actionMsg && (
        <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-semibold">
          {actionMsg}
        </div>
      )}

      {/* Response Breakdown */}
      {doubt.response && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">AI Grounded Solution & Explanation</h2>
            <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded">
              Confidence: {doubt.response.confidence}%
            </span>
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-indigo-950 text-sm leading-relaxed">
            <strong>Direct Answer:</strong> {doubt.response.answer}
          </div>

          {/* Steps */}
          {doubt.response.steps && doubt.response.steps.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Step-by-Step Breakdown</h3>
              <div className="space-y-3">
                {doubt.response.steps.map((s) => (
                  <div key={s.stepNumber} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {s.stepNumber}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm">{s.title}</h4>
                    </div>
                    <p className="text-gray-700 text-xs pl-8">{s.description}</p>
                    {s.formula && (
                      <div className="pl-8 pt-1 text-xs font-mono text-indigo-700 font-bold">
                        Formula: {s.formula}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Personal Explanation */}
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Detailed Personal Explanation</h3>
            <div className="p-4 bg-gray-50 rounded-xl text-gray-800 text-xs leading-relaxed whitespace-pre-line">
              {doubt.response.explanation}
            </div>
          </div>

          {/* Sources */}
          {doubt.response.sourceReferences && doubt.response.sourceReferences.length > 0 && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-1 text-xs">
              <span className="font-bold text-purple-900 block">Verified Educational Sources</span>
              {doubt.response.sourceReferences.map((src, i) => (
                <div key={i} className="text-purple-800">
                  • {src.title} ({src.sourceType})
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleAddToRevision}
              className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold rounded-lg"
            >
              + Add Concept to Smart Revision
            </button>

            <button
              onClick={handlePractice}
              className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-bold rounded-lg"
            >
              🎯 Practice Related Questions
            </button>

            <div className="ml-auto flex items-center space-x-2 text-xs">
              <span className="text-gray-400">Helpful?</span>
              <button onClick={() => handleFeedback(true)} className="px-2.5 py-1 bg-green-100 text-green-800 font-bold rounded">👍 Yes</button>
              <button onClick={() => handleFeedback(false)} className="px-2.5 py-1 bg-red-100 text-red-800 font-bold rounded">👎 No</button>
            </div>
          </div>
        </div>
      )}

      {/* Followup Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Ask a Follow-Up Question</h3>

        {doubt.followups && doubt.followups.length > 0 && (
          <div className="space-y-3">
            {doubt.followups.map((f) => (
              <div key={f.responseId} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
                <p className="font-bold text-indigo-900">Q: "{f.question}"</p>
                <p className="text-gray-800">{f.explanation}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleFollowup} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask a follow-up (e.g. Can you explain step 2 more simply?)..."
            value={followupInput}
            onChange={(e) => setFollowupInput(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={submittingFollowup || !followupInput.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors"
          >
            {submittingFollowup ? 'Submitting...' : 'Ask Follow-Up'}
          </button>
        </form>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate('/doubts')}
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-lg"
        >
          Back to Doubt Solver Hub
        </button>
      </div>
    </div>
  );
};
