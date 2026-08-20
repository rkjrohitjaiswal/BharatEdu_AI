import React, { useEffect, useState } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  completeResourceTracking,
  fetchRecommendedResources,
  fetchResourceCatalog,
  fetchResourceHistory,
  refreshResourceRecommendations,
  startResourceTracking,
} from '../services/api';
import { RecommendedResourceCard } from '../components/resources/RecommendedResourceCard';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ResourceDetails } from '../components/resources/ResourceDetails';
import { ResourceEmptyState } from '../components/resources/ResourceEmptyState';
import { ResourceFilters } from '../components/resources/ResourceFilters';
import { ResourceSearch } from '../components/resources/ResourceSearch';

export const LearningResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [catalog, setCatalog] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Modal State
  const [selectedResource, setSelectedResource] = useState<any | null>(null);

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const [recRes, catRes, histRes] = await Promise.all([
        fetchRecommendedResources(),
        fetchResourceCatalog(),
        fetchResourceHistory(),
      ]);

      if (recRes.success && Array.isArray(recRes.data)) {
        setRecommendations(recRes.data);
        if (recRes.aiExplanation) setAiExplanation(recRes.aiExplanation);
      }
      if (catRes.success && Array.isArray(catRes.data)) {
        setCatalog(catRes.data);
      }
      if (histRes.success && Array.isArray(histRes.data)) {
        setHistory(histRes.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading resources');
    } finally {
      setLoading(false);
    }
  };

  const handleStartResource = async (resourceId: string) => {
    await startResourceTracking(resourceId);
    loadData();
  };

  const handleCompleteResource = async (resourceId: string) => {
    await completeResourceTracking(resourceId);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const topRecommendation = recommendations[0] || null;
  const prereqGapRecs = recommendations.filter((r) => r.priority === 'CRITICAL');
  const weakTopicRecs = recommendations.filter((r) => r.priority === 'HIGH');
  const quickRecs = recommendations.filter((r) => r.estimatedMinutes <= 15);

  const subjectsList = Array.from(new Set(catalog.map((c) => c.subject))).filter(Boolean);

  const filteredCatalog = catalog.filter((res) => {
    if (selectedSubject !== 'all' && res.subject !== selectedSubject) return false;
    if (selectedType !== 'all' && res.resourceType !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchTopic = res.topic.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTopic) return false;
    }
    return true;
  });

  const completedResourceIds = new Set(history.filter((h) => h.status === 'completed').map((h) => h.resourceId));

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Resource Hub</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Curated study materials aligned with your prerequisite gaps and learning targets
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Recommendations</span>
        </button>
      </div>

      {error && <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs font-semibold">{error}</div>}

      {/* Top Recommendation Banner */}
      {topRecommendation && (
        <RecommendedResourceCard
          recommendation={topRecommendation}
          onOpen={(rec) => {
            setSelectedResource(rec);
            handleStartResource(rec.resourceId);
          }}
        />
      )}

      {/* Prerequisite & Learning Gap Recommendations */}
      {prereqGapRecs.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Fix Root Prerequisite Gaps</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {prereqGapRecs.map((rec) => (
              <ResourceCard
                key={rec.resourceId}
                resource={rec}
                onOpen={(r) => {
                  setSelectedResource(r);
                  handleStartResource(r.resourceId);
                }}
                onComplete={handleCompleteResource}
                isCompleted={completedResourceIds.has(rec.resourceId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Study Under 15 Minutes */}
      {quickRecs.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900">⚡ Quick Study (Under 15 Minutes)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {quickRecs.map((rec) => (
              <ResourceCard
                key={rec.resourceId}
                resource={rec}
                onOpen={(r) => {
                  setSelectedResource(r);
                  handleStartResource(r.resourceId);
                }}
                onComplete={handleCompleteResource}
                isCompleted={completedResourceIds.has(rec.resourceId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Resource Catalog Search & Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900">Explore Full Resource Library</h3>
          <div className="flex items-center gap-3">
            <ResourceSearch query={searchQuery} onQueryChange={setSearchQuery} />
            <ResourceFilters
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              subjects={subjectsList}
            />
          </div>
        </div>

        {filteredCatalog.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCatalog.map((res) => (
              <ResourceCard
                key={res.resourceId}
                resource={res}
                onOpen={(r) => {
                  setSelectedResource(r);
                  handleStartResource(r.resourceId);
                }}
                onComplete={handleCompleteResource}
                isCompleted={completedResourceIds.has(res.resourceId)}
              />
            ))}
          </div>
        ) : (
          <ResourceEmptyState />
        )}
      </div>

      {/* Modal */}
      {selectedResource && (
        <ResourceDetails
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onStart={handleStartResource}
          onComplete={handleCompleteResource}
        />
      )}
    </div>
  );
};

export default LearningResourcesPage;
