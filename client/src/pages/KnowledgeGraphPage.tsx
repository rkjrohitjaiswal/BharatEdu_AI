import React, { useEffect, useState } from 'react';
import { GitBranch, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchConceptDependents,
  fetchConceptPrerequisites,
  fetchKnowledgeConcepts,
  fetchStudentConceptReadiness,
  fetchStudentConceptRecommendations,
  fetchStudentRootGaps,
} from '../services/api';
import { ConceptDetails } from '../components/knowledge-graph/ConceptDetails';
import { ConceptGraph } from '../components/knowledge-graph/ConceptGraph';
import { ConceptRecommendationCard } from '../components/knowledge-graph/ConceptRecommendationCard';
import { ConceptSearch } from '../components/knowledge-graph/ConceptSearch';
import { KnowledgeGraphAIInsight } from '../components/knowledge-graph/KnowledgeGraphAIInsight';
import { KnowledgeGraphSummary } from '../components/knowledge-graph/KnowledgeGraphSummary';
import { RootLearningGapCard } from '../components/knowledge-graph/RootLearningGapCard';

export const KnowledgeGraphPage: React.FC = () => {
  const { user } = useAuth();
  const [concepts, setConcepts] = useState<any[]>([]);
  const [readinessList, setReadinessList] = useState<any[]>([]);
  const [rootGaps, setRootGaps] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Modal Details state
  const [selectedConcept, setSelectedConcept] = useState<any | null>(null);
  const [prerequisites, setPrerequisites] = useState<any[]>([]);
  const [dependents, setDependents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const [cRes, rRes, rgRes, recRes] = await Promise.all([
        fetchKnowledgeConcepts(),
        fetchStudentConceptReadiness(user.id),
        fetchStudentRootGaps(user.id),
        fetchStudentConceptRecommendations(user.id),
      ]);

      if (cRes.success && Array.isArray(cRes.data)) setConcepts(cRes.data);
      if (rRes.success && Array.isArray(rRes.data)) setReadinessList(rRes.data);
      if (rgRes.success && Array.isArray(rgRes.data)) setRootGaps(rgRes.data);
      if (recRes.success && Array.isArray(recRes.data)) setRecommendations(recRes.data);
    } catch (err: any) {
      setError(err?.message || 'Error loading knowledge graph data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConceptNode = async (concept: any) => {
    setSelectedConcept(concept);
    setIsModalOpen(true);
    try {
      const [pRes, dRes] = await Promise.all([
        fetchConceptPrerequisites(concept.conceptId),
        fetchConceptDependents(concept.conceptId),
      ]);

      if (pRes.success && Array.isArray(pRes.data)) setPrerequisites(pRes.data);
      if (dRes.success && Array.isArray(dRes.data)) setDependents(dRes.data);
    } catch (err) {
      console.error('Failed to fetch details', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const readinessMap = new Map<string, any>(readinessList.map((r) => [r.conceptId, r]));

  const subjectsList = Array.from(new Set(concepts.map((c) => c.subject))).filter(Boolean);

  const filteredConcepts = concepts.filter((c) => {
    if (selectedSubject !== 'all' && c.subject !== selectedSubject) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchSub = c.subject.toLowerCase().includes(q);
      const matchAlias = (c.aliases || []).some((a: string) => a.toLowerCase().includes(q));
      if (!matchName && !matchSub && !matchAlias) return false;
    }
    return true;
  });

  const topRootGap = rootGaps[0] || null;
  const strongCount = readinessList.filter((r) => r.readinessLevel === 'strong' || r.readinessLevel === 'ready').length;
  const developingCount = readinessList.filter((r) => r.readinessLevel === 'developing').length;
  const weakCount = readinessList.filter((r) => r.readinessLevel === 'weak').length;
  const blockedCount = readinessList.filter((r) => r.isBlocked || r.readinessLevel === 'blocked').length;

  const totalReadiness = readinessList.reduce((acc, r) => acc + r.readinessScore, 0);
  const overallHealthScore = readinessList.length > 0 ? Math.round(totalReadiness / readinessList.length) : 75;

  const summary = {
    totalConcepts: concepts.length,
    strongConceptsCount: strongCount,
    developingConceptsCount: developingCount,
    weakConceptsCount: weakCount,
    blockedConceptsCount: blockedCount,
    overallHealthScore,
    summaryMessage: topRootGap
      ? `Foundational gap detected in ${topRootGap.rootGapConceptName} affecting ${topRootGap.affectedConceptsCount} downstream concept(s).`
      : 'Your concept dependency graph is balanced and clear.',
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Learning Map & Concept Graph</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Prerequisite dependency graph & root learning gap detection engine
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Map</span>
        </button>
      </div>

      {error && <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs">{error}</div>}

      <KnowledgeGraphSummary summary={summary} />

      {topRootGap && <RootLearningGapCard rootGap={topRootGap} />}

      <KnowledgeGraphAIInsight summary={summary} />

      <ConceptSearch
        query={searchQuery}
        onQueryChange={setSearchQuery}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        subjects={subjectsList}
      />

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Mapping curriculum prerequisites & computing concept readiness...</div>
      ) : (
        <div className="space-y-6">
          <ConceptGraph
            concepts={filteredConcepts}
            readinessMap={readinessMap}
            selectedConcept={selectedConcept}
            onSelectConcept={handleSelectConceptNode}
          />

          {recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">Recommended Prerequisite Remediation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {recommendations.map((rec, idx) => (
                  <ConceptRecommendationCard key={idx} recommendation={rec} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Concept Details Modal */}
      {isModalOpen && selectedConcept && (
        <ConceptDetails
          concept={selectedConcept}
          readiness={readinessMap.get(selectedConcept.conceptId)}
          prerequisites={prerequisites}
          dependents={dependents}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default KnowledgeGraphPage;
