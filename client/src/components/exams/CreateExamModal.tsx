import React, { useState } from 'react';
import { Button } from '../Button';
import { GraduationCap, X } from 'lucide-react';

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: any) => Promise<void>;
}

export const CreateExamModal: React.FC<CreateExamModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [examType, setExamType] = useState('school_exam');
  const [board, setBoard] = useState('CBSE');
  const [classLevel, setClassLevel] = useState(10);
  const [examDate, setExamDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [targetScore, setTargetScore] = useState(85);
  const [subjectName, setSubjectName] = useState('Mathematics');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !examDate) return;

    setLoading(true);
    await onSubmit({
      title: title.trim(),
      examType,
      board,
      classLevel: Number(classLevel),
      examDate,
      targetScore: Number(targetScore),
      subjects: [
        {
          subjectId: subjectName.toLowerCase().replace(/\s+/g, '_'),
          subjectName: subjectName.trim(),
          targetPercentage: Number(targetScore),
        },
      ],
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
            <GraduationCap className="w-5 h-5 text-purple-600" /> Create Exam Target
          </h2>
          <p className="text-slate-500 text-xs">Set exam date and target score to generate readiness metrics.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Exam Title *</label>
            <input
              type="text"
              placeholder="e.g. Class 10 Midterm Mathematics Exam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Exam Type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="school_exam">School Exam</option>
                <option value="unit_test">Unit Test</option>
                <option value="midterm">Midterm</option>
                <option value="final_exam">Final Exam</option>
                <option value="board_exam">Board Exam</option>
                <option value="competitive_exam">Competitive Exam</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Exam Date *</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Subject Name *</label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Target Score (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Set Exam Target'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
