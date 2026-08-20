import React, { useEffect, useState } from 'react';
import { BookOpen, RefreshCw, Sparkles } from 'lucide-react';
import {
  completeResourceRecommendation,
  dismissResourceRecommendation,
  fetchRecommendedResources,
  fetchResourceSummary,
  refreshResourceRecommendations,
  startResourceRecommendation,
} from '../services/api';
import {
  IResourceRecommendationClientDTO,
  IResourceRecommendationSummaryClientDTO,
} from '../types/resource-recommendations';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ResourceSummaryCard } from '../components/resources/ResourceSummary';

export const ResourceRecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<IResourceRecommendationClientDTO[]>([]);
  const [summary, setSummary] = useState<IResourceRecommendationSummaryClientDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'history'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [recRes, sumRes] = await Promise.all([fetchRecommendedResources(), fetchResourceSummary()]);
    if (recRes.success && recRes.data) {
      setRecommendations(recRes.data);
    }
    if (sumRes.success && sumRes.data) {
      setSummary(sumRes.data);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshResourceRecommendations();
    await loadData();
    setRefreshing(false);
  };

  const handleStart = async (id: string) => {
    await startResourceRecommendation(id);
    loadData();
  };

  const handleComplete = async (id: string) => {
    await completeResourceRecommendation(id);
    loadData();
  };

  const handleDismiss = async (id: string) => {
    await dismissResourceRecommendation(id);
    loadData();
  };

  const filteredRecs = recommendations.filter((r) => {
    if (activeTab === 'today') return r.status === 'recommended' || r.status === 'started';
    if (activeTab === 'history') return r.status === 'completed' || r.status === 'dismissed';
    return r.status !== 'dismissed';
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-black text-slate-900">AI Resource Recommendations</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Personalized educational content aligned with your Learning Path & Knowledge Gaps.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh AI Recommendations</span>
        </button>
      </div>

      {/* Summary Cards */}
      {summary && <ResourceSummaryCard summary={summary} />}

      {/* AI Strategy Banner */}
      {summary?.aiExplanation && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider">AI Resource Strategy</h4>
            <p className="text-xs text-indigo-800 leading-relaxed font-medium">{summary.aiExplanation}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-xl font-extrabold text-xs transition ${
            activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Recommendations ({recommendations.filter((r) => r.status !== 'dismissed').length})
        </button>
        <button
          onClick={() => setActiveTab('today')}
          className={`px-4 py-1.5 rounded-xl font-extrabold text-xs transition ${
            activeTab === 'today' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Today Queue ({recommendations.filter((r) => r.status === 'recommended' || r.status === 'started').length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-1.5 rounded-xl font-extrabold text-xs transition ${
            activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed & History ({recommendations.filter((r) => r.status === 'completed' || r.status === 'dismissed').length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-40"></div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-40"></div>
        </div>
      ) : filteredRecs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-black text-slate-700">No resources found in this view</h3>
          <p className="text-xs text-slate-500">Refresh AI recommendations or complete current items.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecs.map((rec) => (
            <ResourceCard
              key={rec.id}
              recommendation={rec}
              onStart={handleStart}
              onComplete={handleComplete}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}
    </div>
  );
};
