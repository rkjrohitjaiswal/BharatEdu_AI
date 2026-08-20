import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, RefreshCw, Bookmark, Sparkles, Filter, ShieldCheck, Layers } from 'lucide-react';
import { bookmarkLearningResource, dismissResourceRecommendation, fetchAllLearningResources, fetchResourceBookmarks, fetchResourceRecommendations, recordResourceInteraction, refreshResourceRecommendations, removeResourceBookmark } from '../services/api';
import { ILearningResourceClient, IResourceRecommendationClient } from '../types/learning-resource';
import { ResourceCard } from '../components/resources/ResourceCard';

export const LearningResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<IResourceRecommendationClient[]>([]);
  const [allResources, setAllResources] = useState<ILearningResourceClient[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'recommended' | 'gaps' | 'exam' | 'bookmarks' | 'all'>('recommended');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [recsRes, allRes, bksRes] = await Promise.all([
      fetchResourceRecommendations(),
      fetchAllLearningResources(),
      fetchResourceBookmarks(),
    ]);

    if (recsRes.success && recsRes.data) {
      setRecommendations(recsRes.data);
    }
    if (allRes.success && allRes.data) {
      setAllResources(allRes.data);
    }
    if (bksRes.success && bksRes.data) {
      setBookmarks(bksRes.data.map((b: any) => b.resourceId));
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const res = await refreshResourceRecommendations();
    if (res.success && res.data) {
      setRecommendations(res.data);
    }
    setRefreshing(false);
  };

  const handleBookmarkToggle = async (resourceId: string) => {
    const isB = bookmarks.includes(resourceId);
    if (isB) {
      await removeResourceBookmark(resourceId);
      setBookmarks((prev) => prev.filter((id) => id !== resourceId));
    } else {
      await bookmarkLearningResource(resourceId);
      setBookmarks((prev) => [...prev, resourceId]);
    }
  };

  const handleOpenResource = async (resourceId: string, url?: string | null) => {
    await recordResourceInteraction(resourceId, { interactionType: 'opened' });
    navigate(`/resources/${resourceId}`);
  };

  const handleDismiss = async (recId: string) => {
    await dismissResourceRecommendation(recId);
    setRecommendations((prev) => prev.filter((r) => r.recommendationId !== recId));
  };

  // Filtered lists
  const filteredRecs = recommendations.filter((r) => {
    const res = r.resource;
    if (!res) return false;
    if (subjectFilter !== 'all' && res.subject !== subjectFilter) return false;
    if (typeFilter !== 'all' && res.resourceType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.topicId.toLowerCase().includes(q) ||
        res.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const gapRecs = filteredRecs.filter((r) => r.recommendationContext === 'learning_gap' || r.recommendationContext === 'prerequisite');
  const examRecs = filteredRecs.filter((r) => r.recommendationContext === 'exam');
  const bookmarkedRecs = filteredRecs.filter((r) => bookmarks.includes(r.resourceId));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-black rounded-full uppercase">
              AI Resource Discovery
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Sources
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Personalized Learning Resources</h1>
          <p className="text-sm text-slate-600 font-medium">
            Handpicked educational resources, NCERT textbooks, and targeted practice tailored to your gaps.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Recommendations
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
          {[
            { id: 'recommended', label: `✨ Recommended (${filteredRecs.length})` },
            { id: 'gaps', label: `🎯 Learning Gaps (${gapRecs.length})` },
            { id: 'exam', label: `🔥 Exam Prep (${examRecs.length})` },
            { id: 'bookmarks', label: `🔖 Bookmarked (${bookmarkedRecs.length})` },
            { id: 'all', label: `📚 All Resources (${allResources.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs transition ${
                activeTab === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by topic, concept, subject or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Computer Science">Computer Science</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
            >
              <option value="all">All Resource Types</option>
              <option value="ncert">NCERT Textbook</option>
              <option value="video">Video</option>
              <option value="practice">Practice Quiz</option>
              <option value="documentation">Official Documentation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold text-sm">
          Loading AI Personalized Recommendations...
        </div>
      ) : (
        <div>
          {activeTab === 'recommended' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecs.map((r) => (
                <ResourceCard
                  key={r.recommendationId}
                  recommendation={r}
                  isBookmarked={bookmarks.includes(r.resourceId)}
                  onBookmark={handleBookmarkToggle}
                  onOpen={handleOpenResource}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          )}

          {activeTab === 'gaps' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gapRecs.map((r) => (
                <ResourceCard
                  key={r.recommendationId}
                  recommendation={r}
                  isBookmarked={bookmarks.includes(r.resourceId)}
                  onBookmark={handleBookmarkToggle}
                  onOpen={handleOpenResource}
                />
              ))}
            </div>
          )}

          {activeTab === 'exam' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examRecs.map((r) => (
                <ResourceCard
                  key={r.recommendationId}
                  recommendation={r}
                  isBookmarked={bookmarks.includes(r.resourceId)}
                  onBookmark={handleBookmarkToggle}
                  onOpen={handleOpenResource}
                />
              ))}
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedRecs.map((r) => (
                <ResourceCard
                  key={r.recommendationId}
                  recommendation={r}
                  isBookmarked={true}
                  onBookmark={handleBookmarkToggle}
                  onOpen={handleOpenResource}
                />
              ))}
            </div>
          )}

          {activeTab === 'all' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allResources.map((res) => (
                <ResourceCard
                  key={res.resourceId}
                  resource={res}
                  isBookmarked={bookmarks.includes(res.resourceId)}
                  onBookmark={handleBookmarkToggle}
                  onOpen={handleOpenResource}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
