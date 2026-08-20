import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchStudentResourceDetail, fetchStudentResourceReason, completeStudentResource } from '../services/api';
import { ArrowLeft, ExternalLink, CheckCircle2, BookOpen, Sparkles, Check, HelpCircle, Play } from 'lucide-react';

export const ResourceDetailPage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const [resource, setResource] = useState<any>(null);
  const [reasonData, setReasonData] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resourceId) loadDetail();
  }, [resourceId]);

  const loadDetail = async () => {
    setLoading(true);
    const [resDetail, resReason] = await Promise.all([
      fetchStudentResourceDetail(resourceId!),
      fetchStudentResourceReason(resourceId!),
    ]);

    if (resDetail.success && resDetail.data) {
      setResource(resDetail.data);
    }
    if (resReason.success && resReason.data) {
      setReasonData(resReason.data);
    }
    setLoading(false);
  };

  const handleComplete = async () => {
    if (!resourceId) return;
    const res = await completeStudentResource(resourceId);
    if (res.success) {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading Resource Details...</span>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="p-8 text-center text-gray-500">
        Resource not found.
      </div>
    );
  }

  const coach = reasonData?.coach;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link to="/resources" className="inline-flex items-center space-x-2 text-indigo-600 font-bold text-xs hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Resource Catalog</span>
      </Link>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                {resource.resourceType}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified by {resource.provider}</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">{resource.title}</h1>
          </div>

          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center space-x-2 shadow-md"
          >
            <span>Open Content</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
          {resource.description}
        </p>

        {coach && (
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 p-5 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-2 text-purple-700 font-bold text-xs uppercase mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Why This Resource Was Recommended For You</span>
            </div>
            <p className="text-xs text-gray-800 font-semibold mb-2">{coach.explanation}</p>
            <div className="text-xs text-gray-600 italic">💡 Next Step: {coach.nextStepAdvice}</div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-gray-400 font-medium">Subject</div>
            <div className="font-bold text-gray-900 mt-0.5">{resource.subject}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-gray-400 font-medium">Topic</div>
            <div className="font-bold text-gray-900 mt-0.5">{resource.topic}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-gray-400 font-medium">Difficulty</div>
            <div className="font-bold text-gray-900 capitalize mt-0.5">{resource.difficulty}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-gray-400 font-medium">Est. Duration</div>
            <div className="font-bold text-gray-900 mt-0.5">{resource.durationMinutes} Mins</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={handleComplete}
            disabled={completed}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 ${
              completed ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{completed ? 'Completed ✓' : 'Mark as Complete'}</span>
          </button>

          <div className="flex items-center space-x-3">
            <Link
              to="/doubts"
              className="px-3.5 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold rounded-xl flex items-center space-x-1"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ask Doubt Solver</span>
            </Link>
            <Link
              to="/practice"
              className="px-3.5 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold rounded-xl flex items-center space-x-1"
            >
              <Play className="w-4 h-4" />
              <span>Practice Questions</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
