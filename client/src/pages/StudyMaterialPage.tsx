import React, { useEffect, useState } from 'react';
import { BookOpen, Layers, Plus, RefreshCw, Sparkles, X } from 'lucide-react';
import {
  archiveStudyMaterial,
  fetchRecommendedStudyMaterials,
  fetchStudyMaterialFlashcards,
  fetchStudyMaterialSummary,
  generateStudyMaterial,
  reviewStudyFlashcard,
} from '../services/api';
import { IStudyFlashcardClientDTO, IStudyMaterialClientDTO, IStudyMaterialSummaryClientDTO, MaterialType } from '../types/study-material';
import { FlashcardViewer } from '../components/study-material/FlashcardViewer';
import { StudyMaterialCard } from '../components/study-material/StudyMaterialCard';
import { StudyMaterialSummaryCard } from '../components/study-material/StudyMaterialSummary';

export const StudyMaterialPage: React.FC = () => {
  const [materials, setMaterials] = useState<IStudyMaterialClientDTO[]>([]);
  const [summary, setSummary] = useState<IStudyMaterialSummaryClientDTO | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<IStudyMaterialClientDTO | null>(null);
  const [flashcards, setFlashcards] = useState<IStudyFlashcardClientDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'history'>('all');
  const [selectedType, setSelectedType] = useState<MaterialType | 'all'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [matRes, sumRes] = await Promise.all([fetchRecommendedStudyMaterials(), fetchStudyMaterialSummary()]);
    if (matRes.success && Array.isArray(matRes.data)) {
      setMaterials(matRes.data);
    }
    if (sumRes.success && sumRes.data) {
      setSummary(sumRes.data);
    }
    setLoading(false);
  };

  const handleGenerateNew = async (materialType?: MaterialType) => {
    setGenerating(true);
    await generateStudyMaterial({ materialType: materialType || 'detailed_notes' });
    await loadData();
    setGenerating(false);
  };

  const handleSelectMaterial = async (id: string) => {
    const target = materials.find((m) => m.id === id || m.materialId === id);
    if (target) {
      setSelectedMaterial(target);
      const fcRes = await fetchStudyMaterialFlashcards(target.id);
      if (fcRes.success && Array.isArray(fcRes.data)) {
        setFlashcards(fcRes.data);
      }
    }
  };

  const handleArchive = async (id: string) => {
    await archiveStudyMaterial(id);
    loadData();
  };

  const handleFlashcardReview = async (id: string, outcome: 'again' | 'hard' | 'good' | 'easy') => {
    await reviewStudyFlashcard(id, outcome);
    if (selectedMaterial) {
      const fcRes = await fetchStudyMaterialFlashcards(selectedMaterial.id);
      if (fcRes.success && Array.isArray(fcRes.data)) {
        setFlashcards(fcRes.data);
      }
    }
  };

  const filteredMaterials = materials.filter((m) => {
    if (selectedType !== 'all' && m.materialType !== selectedType) return false;
    if (activeTab === 'today') return m.status === 'ready';
    if (activeTab === 'history') return m.status === 'archived';
    return m.status !== 'archived';
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-black text-slate-900">AI Study Material & Notes Generator</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Personalized notes, summaries, flashcards, key points & formula sheets tailored to your Learning Path.
          </p>
        </div>

        <button
          onClick={() => handleGenerateNew('detailed_notes')}
          disabled={generating}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition disabled:opacity-50"
        >
          <Plus className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
          <span>Generate New Study Notes</span>
        </button>
      </div>

      {/* Summary Cards */}
      {summary && <StudyMaterialSummaryCard summary={summary} />}

      {/* AI Strategy Banner */}
      {summary?.aiExplanation && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider">AI Study Strategy</h4>
            <p className="text-xs text-indigo-800 leading-relaxed font-medium">{summary.aiExplanation}</p>
          </div>
        </div>
      )}

      {/* Type Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { label: 'All Formats', value: 'all' },
          { label: 'Detailed Notes', value: 'detailed_notes' },
          { label: 'Quick Notes', value: 'quick_notes' },
          { label: 'Key Points', value: 'key_points' },
          { label: 'Formula Sheet', value: 'formula_sheet' },
          { label: 'Revision Sheet', value: 'revision_sheet' },
          { label: 'Exam Notes', value: 'exam_notes' },
        ].map((pill) => (
          <button
            key={pill.value}
            onClick={() => setSelectedType(pill.value as any)}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 transition ${
              selectedType === pill.value ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Material Modal/Viewer overlay */}
      {selectedMaterial && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-indigo-600">
                {selectedMaterial.subject} • {selectedMaterial.materialType.replace('_', ' ')}
              </span>
              <h2 className="text-lg font-black text-slate-900">{selectedMaterial.title}</h2>
            </div>
            <button
              onClick={() => setSelectedMaterial(null)}
              className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {selectedMaterial.sections.map((sec, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{sec.title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{sec.content}</p>
                {sec.bullets && (
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {sec.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Flashcards Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-black text-slate-900">Interactive Concept Flashcards</h3>
            <FlashcardViewer flashcards={flashcards} onReview={handleFlashcardReview} />
          </div>
        </div>
      )}

      {/* Material Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-48"></div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-48"></div>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-black text-slate-700">No study materials in this category</h3>
          <p className="text-xs text-slate-500">Click "Generate New Study Notes" to create personalized materials.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((mat) => (
            <StudyMaterialCard key={mat.id} material={mat} onSelect={handleSelectMaterial} onArchive={handleArchive} />
          ))}
        </div>
      )}
    </div>
  );
};
