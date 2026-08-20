import React from 'react';
import { ArrowDown } from 'lucide-react';
import { ConceptNode } from './ConceptNode';

export interface ConceptGraphProps {
  concepts: any[];
  readinessMap: Map<string, any>;
  selectedConcept: any;
  onSelectConcept: (concept: any) => void;
}

export const ConceptGraph: React.FC<ConceptGraphProps> = ({
  concepts,
  readinessMap,
  selectedConcept,
  onSelectConcept,
}) => {
  // Group concepts by category for structured hierarchical display
  const mathChain = concepts.filter((c) => c.subject === 'Mathematics');
  const csChain = concepts.filter((c) => c.subject === 'Computer Science');
  const scienceChain = concepts.filter((c) => c.subject !== 'Mathematics' && c.subject !== 'Computer Science');

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-extrabold text-sm text-slate-900">Concept Hierarchy & Dependency Graph</h3>
        <span className="text-[11px] font-semibold text-slate-500">Click any concept node to inspect dependencies</span>
      </div>

      <div className="space-y-6">
        {/* Math Branch */}
        {mathChain.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700">Mathematics Pathway</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {mathChain.map((concept) => (
                <ConceptNode
                  key={concept.conceptId}
                  concept={concept}
                  readiness={readinessMap.get(concept.conceptId)}
                  onSelect={onSelectConcept}
                  isSelected={selectedConcept?.conceptId === concept.conceptId}
                />
              ))}
            </div>
          </div>
        )}

        {/* CS Branch */}
        {csChain.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700">Computer Science Pathway</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {csChain.map((concept) => (
                <ConceptNode
                  key={concept.conceptId}
                  concept={concept}
                  readiness={readinessMap.get(concept.conceptId)}
                  onSelect={onSelectConcept}
                  isSelected={selectedConcept?.conceptId === concept.conceptId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Science Branch */}
        {scienceChain.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Sciences Pathway</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {scienceChain.map((concept) => (
                <ConceptNode
                  key={concept.conceptId}
                  concept={concept}
                  readiness={readinessMap.get(concept.conceptId)}
                  onSelect={onSelectConcept}
                  isSelected={selectedConcept?.conceptId === concept.conceptId}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
