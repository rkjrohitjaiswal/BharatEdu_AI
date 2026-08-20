import React, { useEffect, useState } from 'react';
import { BookOpen, ExternalLink, PlayCircle } from 'lucide-react';
import { fetchRecommendedStudyMaterials } from '../../services/api';
import { IStudyMaterialClientDTO } from '../../types/study-material';

export const StudyMaterialCard: React.FC = () => {
  const [material, setMaterial] = useState<IStudyMaterialClientDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopMaterial();
  }, []);

  const loadTopMaterial = async () => {
    setLoading(true);
    const res = await fetchRecommendedStudyMaterials();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      setMaterial(res.data[0]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Personalized Study Notes</span>
        </div>
        <p className="text-xs text-slate-600">Generated study materials are fully synced!</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-black uppercase tracking-wider text-indigo-600">Personalized Study Material</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-[10px]">
          {material.materialType.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-black text-slate-900 leading-snug">{material.title}</h4>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {material.sections[0]?.content || 'Personalized study notes aligned with your active curriculum.'}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-500">
          ⏱️ {material.estimatedMinutes} mins • {material.subject}
        </span>
        <a
          href="/study-material"
          className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs inline-flex items-center gap-1 transition"
        >
          <PlayCircle className="w-3.5 h-3.5" /> Read Notes <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>
    </div>
  );
};
