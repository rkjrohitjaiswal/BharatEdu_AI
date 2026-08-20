import React, { useEffect, useState } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import {
  fetchAllResources,
  fetchRecommendedResources,
  fetchResourceRecommendationSummary,
  refreshResourceRecommendations,
  updateRecommendationStatus,
} from '../services/api';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ResourceEmptyState } from '../components/resources/ResourceEmptyState';
import { ResourceFilters } from '../components/resources/ResourceFilters';
import { ResourceList } from '../components/resources/ResourceList';
import { ResourceSummary } from '../components/resources/ResourceSummary';
import { ResourceAIInsight } from '../components/resources/ResourceAIInsight';

export const LearningResourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'catalog'>('recommended');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [recRes, catRes, sumRes] = await Promise.all([
        fetchRecommendedResources(),
        fetchAllResources(),
        fetchResourceRecommendationSummary(),
      ]);

      if (recRes.success && Array.isArray(recRes.data)) setRecommendations(recRes.data);
      else setError(recRes.message || 'Failed to load recommendations');

      if (catRes.success && Array.isArray(catRes.data)) setCatalog(catRes.data);
      if (sumRes.success) setSummary(sumRes.data);
    } catch (err: any) {
      setError(err?.message || 'Error loading learning resources');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await refreshResourceRecommendations();
      if (res.success && Array.isArray(res.data)) {
        setRecommendations(res.data);
        const sRes = await fetchResourceRecommendationSummary();
        if (sRes.success) setSummary(sRes.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to refresh recommendations');
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await updateRecommendationStatus(id, status);
      if (res.success && res.data) {
        setRecommendations((prev) =>
          prev.map((item) =>
            item.recommendationId === id || item.resource?.id === id ? { ...item, status } : item
          )
        );
      }
    } catch (err: any) {
      console.error('Failed to update status', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const subjectsList = Array.from(
    new Set([...catalog.map((r) => r.subject), ...recommendations.map((r) => r.resource?.subject)])
  ).filter(Boolean);

  const filteredRecommendations = recommendations.filter((rec) => {
    const res = rec.resource;
    if (!res) return true;
    if (selectedSubject !== 'all' && res.subject !== selectedSubject) return false;
    if (selectedType !== 'all' && res.resourceType !== selectedType) return false;
    if (verifiedOnly && !res.verified) return false;
    return true;
  });

  const filteredCatalog = catalog.filter((res) => {
    if (selectedSubject !== 'all' && res.subject !== selectedSubject) return false;
    if (selectedType !== 'all' && res.resourceType !== selectedType) return false;
    if (verifiedOnly && !res.verified) return false;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Learning Resources</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Intelligent educational materials prioritized for weak topics, gaps & readiness targets
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Recommendations</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('recommended')}
          className={`pb-3 text-xs font-bold transition border-b-2 ${
            activeTab === 'recommended'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Recommended for You ({filteredRecommendations.length})
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 text-xs font-bold transition border-b-2 ${
            activeTab === 'catalog'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Full Catalog ({filteredCatalog.length})
        </button>
      </div>

      <ResourceSummary summary={summary} />

      <ResourceFilters
        selectedSubject={selectedSubject}
        onSelectSubject={setSelectedSubject}
        selectedType={selectedType}
        onSelectType={setSelectedType}
        verifiedOnly={verifiedOnly}
        onToggleVerified={setVerifiedOnly}
        subjects={subjectsList}
      />

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Evaluating student progress & ranking verified resources...</div>
      ) : activeTab === 'recommended' ? (
        filteredRecommendations.length > 0 ? (
          <div className="space-y-6">
            <ResourceList recommendations={filteredRecommendations} onUpdateStatus={handleUpdateStatus} />
            <ResourceAIInsight summary={summary} />
          </div>
        ) : (
          <ResourceEmptyState onRefresh={handleRefresh} />
        )
      ) : filteredCatalog.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCatalog.map((item) => (
            <ResourceCard key={item.id} resource={item} />
          ))}
        </div>
      ) : (
        <ResourceEmptyState onRefresh={loadData} />
      )}
    </div>
  );
};

export default LearningResourcesPage;
