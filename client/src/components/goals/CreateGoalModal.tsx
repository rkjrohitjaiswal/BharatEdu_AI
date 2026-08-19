import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Target, X } from 'lucide-react';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: any) => Promise<void>;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalType, setGoalType] = useState('practice_questions');
  const [targetValue, setTargetValue] = useState(25);
  const [unit, setUnit] = useState('questions');
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || targetValue <= 0) return;

    setLoading(true);
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      goalType,
      targetValue: Number(targetValue),
      unit,
      targetDate,
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" /> Set New Learning Goal
          </h2>
          <p className="text-slate-500 text-xs">Define a measurable goal to track your study progress.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Goal Title *</label>
            <input
              type="text"
              placeholder="e.g. Solve 50 Math Questions"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Goal Type</label>
            <select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="practice_questions">Practice Questions</option>
              <option value="mastery">Overall Mastery Level (%)</option>
              <option value="practice_accuracy">Practice Accuracy (%)</option>
              <option value="study_streak">Study Streak (Days)</option>
              <option value="study_minutes">Study Activity (Minutes)</option>
              <option value="topic_completion">Topics Mastered</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Target Value *</label>
              <input
                type="number"
                min="1"
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Target Date *</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Description (Optional)</label>
            <textarea
              placeholder="Add details or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 h-20"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
