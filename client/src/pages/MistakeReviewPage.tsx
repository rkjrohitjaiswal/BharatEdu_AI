import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { fetchStudentMistakes } from '../services/api';
import { AlertTriangle, BookOpen, Bot, CheckCircle2, RotateCcw, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MistakeReviewPage: React.FC = () => {
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStudentMistakes(20).then((res) => {
      if (res.success && res.data) {
        setMistakes(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mistake Review & AI Explanations"
        description="Review incorrect practice answers, understand core misconceptions, and reinforce key concepts."
        badge={<Badge variant="amber">AI Diagnostic</Badge>}
      />

      {mistakes.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-xs text-emerald-600 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-lg text-slate-900">Zero Recent Mistakes!</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Great job! You have answered all recent practice questions correctly. Continue practicing to maintain your streak.
            </p>
            <Link to="/practice">
              <Button icon={<RotateCcw className="w-4 h-4" />}>Start Practice Session</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {mistakes.map((m, idx) => (
            <Card key={m._id || m.id || idx}>
              <div className="space-y-4 text-xs">
                {/* Header Info */}
                <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{m.topicName}</h4>
                      <Badge variant="slate" size="sm">{m.subjectName}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Practiced on {new Date(m.timestamp).toLocaleDateString('en-IN')} • Difficulty: {m.difficulty}
                    </p>
                  </div>
                  <Badge variant="amber" size="sm">Review Needed</Badge>
                </div>

                {/* Question & Answers */}
                <div className="space-y-2">
                  <p className="font-bold text-slate-900 text-sm">Question: "{m.questionText}"</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Your Answer</span>
                      <p className="font-semibold text-red-900">{m.studentAnswer || 'No answer submitted'}</p>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Correct Solution</span>
                      <p className="font-semibold text-emerald-900">{m.correctAnswer}</p>
                    </div>
                  </div>
                </div>

                {/* AI Explanation & Key Concept */}
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
                  <div className="space-y-1">
                    <h5 className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      AI Step-by-Step Explanation
                    </h5>
                    <p className="text-slate-700 leading-relaxed">{m.explanation}</p>
                  </div>

                  {m.keyConcept && (
                    <div className="pt-2 border-t border-amber-200/60">
                      <span className="font-bold text-amber-900">Key Concept to Remember: </span>
                      <span className="text-slate-700">{m.keyConcept}</span>
                    </div>
                  )}

                  {m.misconception && m.misconception !== 'No specific misconception pattern detected.' && (
                    <div className="p-2.5 bg-amber-100/70 rounded-lg text-amber-900">
                      <span className="font-bold">Likely Misconception Pattern: </span>
                      <span>{m.misconception}</span>
                    </div>
                  )}
                </div>

                {/* Grounded RAG Citations */}
                {m.sources && m.sources.length > 0 && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                      Retrieved Educational Sources
                    </h5>
                    <div className="space-y-1">
                      {m.sources.map((src: any, sIdx: number) => (
                        <div key={sIdx} className="flex justify-between items-center text-[11px] text-slate-600">
                          <span>• {src.title} ({src.publisher || 'NCERT'})</span>
                          {src.sourceUrl && (
                            <a href={src.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline flex items-center gap-0.5">
                              View Source <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <Link to="/tutor">
                    <Button size="sm" variant="outline" icon={<Bot className="w-3.5 h-3.5 text-purple-600" />}>
                      Ask AI Tutor
                    </Button>
                  </Link>
                  <Link to="/practice">
                    <Button size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />}>
                      Practice Topic Again
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
