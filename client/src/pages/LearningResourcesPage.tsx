import React, { useEffect, useState } from 'react';
import { fetchStudentRecommendedResources, fetchStudentResourceList } from '../services/api';
import { ResourceHeader } from '../components/resources/ResourceHeader';
import { ResourceSearch } from '../components/resources/ResourceSearch';
import { ResourceFilters } from '../components/resources/ResourceFilters';
import { ResourceRecommendationCard } from '../components/resources/ResourceRecommendationCard';
import { PersonalizedResources } from '../components/resources/PersonalizedResources';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ResourceEmptyState } from '../components/resources/ResourceEmptyState';

export const LearningResourcesPage: React.FC = () => {
  const [ranking, setRanking] = useState<any>(null);
  const [allResources, setAllResources] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [format, setFormat] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    const [recRes, catalogRes] = await Promise.all([
      fetchStudentRecommendedResources(),
      fetchStudentResourceList(),
    ]);

    if (recRes.success && recRes.data) {
      setRanking(recRes.data);
    }
    if (catalogRes.success && catalogRes.data) {
      setAllResources(catalogRes.data);
    }
    setLoading(false);
  };

  const filteredCatalog = allResources.filter((res) => {
    const matchSearch =
      !search ||
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.topic.toLowerCase().includes(search.toLowerCase()) ||
      res.subject.toLowerCase().includes(search.toLowerCase());

    const matchSub = subject === 'All' || res.subject === subject;
    const matchFmt = format === 'All' || res.resourceType === format;

    return matchSearch && matchSub && matchFmt;
  });

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading AI Verified Learning Resources...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <ResourceHeader />

      {ranking && ranking.topRecommendation && (
        <ResourceRecommendationCard recommendation={ranking.topRecommendation} />
      )}

      {ranking && ranking.recommendations && (
        <PersonalizedResources recommendations={ranking.recommendations} />
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Browse All Verified Resources</h3>
        <ResourceSearch value={search} onChange={setSearch} />
        <ResourceFilters
          selectedSubject={subject}
          onSelectSubject={setSubject}
          selectedType={format}
          onSelectType={setFormat}
        />

        {filteredCatalog.length === 0 ? (
          <ResourceEmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalog.map((res, idx) => (
              <ResourceCard key={idx} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
