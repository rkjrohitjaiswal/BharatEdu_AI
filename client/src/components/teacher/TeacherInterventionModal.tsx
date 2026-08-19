import React, { useState } from 'react';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { createTeacherIntervention } from '../../services/api';
import { X, Send, Sparkles, AlertCircle } from 'lucide-react';

interface TeacherInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssigned?: () => void;
  prefillData?: {
    studentId: string;
    studentName?: string;
    classId?: string;
    className?: string;
    subjectId?: string;
    subjectName?: string;
    topicId?: string;
    topicName?: string;
    priority?: 'critical' | 'high' | 'medium' | 'low';
    suggestedType?: 'practice' | 'tutor' | 'revision' | 'study_plan';
  };
}

export const TeacherInterventionModal: React.FC<TeacherInterventionModalProps> = ({
  isOpen,
  onClose,
  onAssigned,
  prefillData,
}) => {
  const [type, setType] = useState<'practice' | 'tutor' | 'revision' | 'study_plan'>(
    prefillData?.suggestedType || 'practice'
  );
  const [priority, setPriority] = useState<'critical' | 'high' | 'medium' | 'low'>(
    prefillData?.priority || 'high'
  );
  const [title, setTitle] = useState<string>(
    prefillData?.topicName ? `Remedial ${prefillData.topicName} Practice` : 'Targeted Learning Intervention'
  );
  const [instructions, setInstructions] = useState<string>(
    prefillData?.topicName
      ? `Please complete 5 practice questions focusing on ${prefillData.topicName} to strengthen core conceptual mastery.`
      : 'Complete assigned learning task to address active learning gaps.'
  );
  const [teacherNote, setTeacherNote] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instructions.trim()) {
      setError('Title and instructions are required');
      return;
    }

    if (!prefillData?.studentId) {
      setError('Student selection is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    const res = await createTeacherIntervention({
      studentId: prefillData.studentId,
      classId: prefillData.classId,
      subjectId: prefillData.subjectId,
      topicId: prefillData.topicId,
      type,
      title: title.trim(),
      instructions: instructions.trim(),
      teacherNote: teacherNote.trim() || undefined,
      priority,
      dueDate,
    });

    setSubmitting(false);

    if (res.success) {
      if (onAssigned) onAssigned();
      onClose();
    } else {
      setError(res.message || 'Failed to assign intervention');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-xl text-xs">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Assign Teacher Intervention
            </h3>
            {prefillData?.studentName && (
              <p className="text-slate-500 mt-0.5">
                Target Student: <strong className="text-slate-800">{prefillData.studentName}</strong>
                {prefillData.topicName && ` • Topic: ${prefillData.topicName}`}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Intervention Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="practice">Focused Practice</option>
                <option value="tutor">AI Tutor Session</option>
                <option value="revision">Concept Revision</option>
                <option value="study_plan">Study Plan Integration</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assignment Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
              placeholder="e.g. Remedial Algebra Practice"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Student Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              placeholder="Clear instructions for the student..."
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Teacher Note (Optional)</label>
            <input
              type="text"
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              placeholder="Internal pedagogical notes..."
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} icon={<Send className="w-3.5 h-3.5" />}>
              {submitting ? 'Assigning...' : 'Assign Remediation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
