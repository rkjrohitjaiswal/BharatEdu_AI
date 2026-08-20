import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookmarkLearningResource, fetchLearningResourceDetails, recordResourceInteraction, removeResourceBookmark } from '../services/api';
import { ILearningResourceClient } from '../types/learning-resource';
import { ExternalLink, Bookmark, Clock, ShieldCheck, CheckCircle, ThumbsUp, ThumbsDown, ArrowLeft, Target, BrainCircuit } from 'lucide-react';

export const ResourceDetailsPage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<ILearningResourceClient | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (resourceId) loadDetails();
  }, [resourceId]);

  const loadDetails = async () => {
    setLoading(true);
    const res = await fetchLearningResourceDetails(resourceId!);
    if (res.success && res.data) {
      setResource(res.data);
    }
    setLoading(false);
  };

  const handleBookmarkToggle = async () => {
    if (!resource) return;
    if (isBookmarked) {
      await removeResourceBookmark(resource.resourceId);
      setIsBookmarked(false);
      setFeedbackMsg('Bookmark removed.');
    } else {
      await bookmarkLearningResource(resource.resourceId);
      setIsBookmarked(true);
      setFeedbackMsg('Saved to your Bookmarks!');
    }
  };

  const handleHelpful = async (helpful: boolean) => {
    if (!resource) return;
    await recordResourceInteraction(resource.resourceId, {
      interactionType: helpful ? 'helpful' : 'not_helpful',
    });
    setFeedbackMsg(helpful ? 'Thank you! Marked as helpful.' : 'Thank you for your feedback.');
  };

  const handlePractice = () => {
    if (!resource) return;
    navigate(`/assessments`);
  };

  const handleAddToRevision = () => {
    if (!resource) return;
    navigate(`/revision`);
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading Resource Details...</div>;
  if (!resource) return <div className="p-12 text-center text-slate-500 font-bold">Resource not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/resources')}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Resource Discovery
      </button>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 font-bold text-xs rounded-full uppercase">
              {resource.subject} • {resource.resourceType}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full uppercase">
              Difficulty: {resource.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" /> {resource.estimatedMinutes} mins
            </span>
            {resource.verified && (
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <ShieldCheck className="w-4 h-4" /> Verified Source
              </span>
            )}
          </div>
        </div>

        {feedbackMsg && (
          <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs font-bold">
            {feedbackMsg}
          </div>
        )}

        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold text-slate-900 leading-snug">{resource.title}</h1>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">{resource.description}</p>
        </div>

        {/* Metadata Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Provider</span>
            <span className="font-extrabold text-slate-800">{resource.provider}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Class & Board</span>
            <span className="font-extrabold text-slate-800">{resource.classLevel} • {resource.board}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Topic / Concept</span>
            <span className="font-extrabold text-slate-800">{resource.topicId}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Quality Score</span>
            <span className="font-extrabold text-indigo-700">{resource.qualityScore}%</span>
          </div>
        </div>

        {/* Prerequisites */}
        {resource.prerequisites && resource.prerequisites.length > 0 && (
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-2 text-xs">
            <span className="font-bold text-purple-900 uppercase block">Prerequisite Knowledge Required</span>
            <div className="flex flex-wrap gap-2">
              {resource.prerequisites.map((p, i) => (
                <span key={i} className="px-2.5 py-1 bg-white text-purple-800 rounded-lg font-bold border border-purple-200">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
          {resource.url ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md transition"
            >
              Open External Verified Link <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <button
              onClick={handlePractice}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md transition"
            >
              Start Interactive Practice Quiz
            </button>
          )}

          <button
            onClick={handleBookmarkToggle}
            className={`px-5 py-3 rounded-xl font-bold text-xs border transition flex items-center gap-2 ${
              isBookmarked ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Bookmark className="w-4 h-4" /> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          <button
            onClick={handlePractice}
            className="px-5 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs rounded-xl flex items-center gap-2 border border-indigo-100"
          >
            <Target className="w-4 h-4" /> Practice Concept
          </button>

          <button
            onClick={handleAddToRevision}
            className="px-5 py-3 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl flex items-center gap-2 border border-purple-100"
          >
            <BrainCircuit className="w-4 h-4" /> Smart Revision
          </button>

          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold">Helpful?</span>
            <button onClick={() => handleHelpful(true)} className="p-2 bg-slate-100 hover:bg-emerald-100 text-emerald-700 rounded-lg">
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button onClick={() => handleHelpful(false)} className="p-2 bg-slate-100 hover:bg-red-100 text-red-700 rounded-lg">
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
