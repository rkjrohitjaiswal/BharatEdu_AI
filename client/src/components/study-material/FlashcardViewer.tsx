import React, { useState } from 'react';
import { CheckCircle2, RotateCw } from 'lucide-react';
import { IStudyFlashcardClientDTO } from '../../types/study-material';

export interface FlashcardViewerProps {
  flashcards: IStudyFlashcardClientDTO[];
  onReview: (id: string, outcome: 'again' | 'hard' | 'good' | 'easy') => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ flashcards, onReview }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="p-6 text-center border rounded-2xl bg-white border-slate-200 text-xs text-slate-500 font-medium">
        No flashcards generated for this material yet.
      </div>
    );
  }

  const current = flashcards[currentIndex % flashcards.length];

  const handleOutcome = (outcome: 'again' | 'hard' | 'good' | 'easy') => {
    onReview(current.id, outcome);
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  return (
    <div className="p-6 rounded-2xl border bg-white border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
          Flashcard {currentIndex + 1} of {flashcards.length}
        </span>
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="text-xs font-extrabold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
        >
          <RotateCw className="w-3.5 h-3.5" /> Flip Card
        </button>
      </div>

      <div
        onClick={() => setShowAnswer(!showAnswer)}
        className="min-h-[160px] p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-center items-center text-center cursor-pointer space-y-3 transition hover:border-indigo-300"
      >
        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
          {showAnswer ? 'Answer & Explanation' : 'Question'}
        </p>
        <h3 className="text-sm font-black text-slate-900 leading-snug">
          {showAnswer ? current.answer : current.question}
        </h3>
        {showAnswer && current.explanation && (
          <p className="text-xs text-slate-600 leading-relaxed font-medium">{current.explanation}</p>
        )}
      </div>

      {showAnswer ? (
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => handleOutcome('again')}
            className="py-2 px-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-black transition"
          >
            Again
          </button>
          <button
            onClick={() => handleOutcome('hard')}
            className="py-2 px-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-black transition"
          >
            Hard
          </button>
          <button
            onClick={() => handleOutcome('good')}
            className="py-2 px-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black transition"
          >
            Good
          </button>
          <button
            onClick={() => handleOutcome('easy')}
            className="py-2 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black transition"
          >
            Easy
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAnswer(true)}
          className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition"
        >
          Show Answer
        </button>
      )}
    </div>
  );
};
