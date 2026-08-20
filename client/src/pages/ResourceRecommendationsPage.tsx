import React, { useEffect, useState } from 'react';
import {
  fetchRecommendedResources,
  fetchTodayResources,
  fetchExamResources,
  fetchGapResources,
  fetchPrerequisiteResources,
  fetchCareerResources,
  fetchRevisionResources,
  searchResources,
} from '../services/api';
import { IResourceRecommendationClient } from '../types/resource-recommendation';

import { RecommendedForYou } from '../components/resources/RecommendedForYou';
import { ExamResourceCollection } from '../components/resources/ExamResourceCollection';
import { GapResourceCollection } from '../components/resources/GapResourceCollection';
import { CareerResourceCollection } from '../components/resources/CareerResourceCollection';
import { RevisionResourceCollection } from '../components/resources/RevisionResourceCollection';
import { PrerequisiteResourceCollection } from '../components/resources/PrerequisiteResourceCollection';
import { ResourceSearch } from '../components/resources/ResourceSearch';
import { ResourceFilters } from '../components/resources/ResourceFilters';
import { ResourceAIInsight } from '../components/resources/ResourceAIInsight';
import { ResourceEmptyState } from '../components/resources/ResourceEmptyState';
import { Sparkles, BookOpen } from 'lucide-react';

export const ResourceRecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<IResourceRecommendationClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    const res = await fetchRecommendedResources();
    if (res.success && res.data) {
      setRecommendations(res.data);
    }
    setLoading(false);
  };

  const filteredRecs = recommendations.filter((r) => {
    const res = r.resource;
    if (!res) return false;

    if (selectedSubject !== 'all' && res.subject !== selectedSubject) return false;
    if (selectedLanguage !== 'all' && res.language !== selectedLanguage) return false;
    if (selectedDifficulty !== 'all' && res.difficulty !== selectedDifficulty) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(term);
      const matchDesc = res.description.toLowerCase().includes(term);
      const matchTopic = res.topic.toLowerCase().includes(term);
      if (!matchTitle && !matchDesc && !matchTopic) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading Academic Resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-3 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>AI Academic Resource Recommendation Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Verified Educational Resource Catalog</h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Curated, verified educational materials (NCERT, DIKSHA, CBSE, NIOS) personalized to your mastery gaps, knowledge graph prerequisites, exam preparations, and career goals.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-3">
          <ResourceSearch value={searchTerm} onChange={setSearchTerm} />
          <ResourceFilters
            selectedSubject={selectedSubject}
            selectedLanguage={selectedLanguage}
            selectedDifficulty={selectedDifficulty}
            onSubjectChange={setSelectedSubject}
            onLanguageChange={setSelectedLanguage}
            onDifficultyChange={setSelectedDifficulty}
          />
        </div>

        {/* AI Insight Banner */}
        <ResourceAIInsight />

        {/* Recommended Collections */}
        {filteredRecs.length === 0 ? (
          <ResourceEmptyState />
        ) : (
          <div className="space-y-10">
            <RecommendedForYou recommendations={filteredRecs} />
            <GapResourceCollection recommendations={filteredRecs.filter((r) => r.priority === 'critical' || r.priority === 'high')} />
            <PrerequisiteResourceCollection recommendations={filteredRecs.filter((r) => r.resource?.prerequisites && r.resource.prerequisites.length > 0)} />
            <ExamResourceCollection recommendations={filteredRecs.filter((r) => r.examRelevance && r.examRelevance.length > 0)} />
            <CareerResourceCollection recommendations={filteredRecs.filter((r) => r.careerRelevance && r.careerRelevance.length > 0)} />
            <RevisionResourceCollection recommendations={filteredRecs.filter((r) => r.resource?.resourceType === 'reference' || r.resource?.resourceType === 'practice_set')} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceRecommendationsPage;
