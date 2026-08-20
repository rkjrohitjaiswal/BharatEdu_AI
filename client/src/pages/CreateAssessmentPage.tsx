import React, { useState } from 'react';
import { Award, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createTeacherAssessment, addQuestionToAssessment } from '../services/api';

export const CreateAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [classLevel, setClassLevel] = useState('Class 10');
  const [board, setBoard] = useState('CBSE');
  const [assessmentType, setAssessmentType] = useState('assignment');
  const [totalMarks, setTotalMarks] = useState(100);
  const [saving, setSaving] = useState(false);

  // Question form state
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState('mcq');
  const [qMarks, setQMarks] = useState(5);
  const [qCorrect, setQCorrect] = useState('');
  const [qOptions, setQOptions] = useState('Option A, Option B, Option C, Option D');
  const [questionsAdded, setQuestionsAdded] = useState<any[]>([]);

  const handleCreate = async () => {
    if (!title) return;
    setSaving(true);
    const res = await createTeacherAssessment({
      title,
      subject,
      classLevel,
      board,
      assessmentType,
      totalMarks: Number(totalMarks),
      status: 'draft',
    });

    if (res.success && res.data?.assessmentId) {
      const asmId = res.data.assessmentId;
      // Add standard question
      if (qText) {
        await addQuestionToAssessment(asmId, {
          question: qText,
          questionType: qType,
          marks: Number(qMarks),
          correctAnswer: qCorrect || 'Option A',
          options: qOptions.split(',').map((o) => o.trim()),
          expectedPoints: ['Define formula', 'Show calculations'],
        });
      }
      navigate('/teacher/assessments');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plus className="w-6 h-6 text-purple-400" />
            Create Teacher Assessment
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure assessment details, rubrics, and initial questions.</p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-semibold mb-1 block">Assessment Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mid-Term Algebra & Functions Assignment"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Assessment Type</label>
              <select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
              >
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="subjective_test">Subjective Test</option>
                <option value="coding_assessment">Coding Assessment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Class Level</label>
              <input
                type="text"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Board</label>
              <input
                type="text"
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Total Marks</label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-purple-300">Add First Question</h3>
            <div>
              <label className="text-xs text-slate-300 mb-1 block">Question Prompt</label>
              <textarea
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="e.g. Solve the quadratic equation 2x^2 + 5x - 3 = 0 and explain your reasoning."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 mb-1 block">Question Type</label>
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                >
                  <option value="short_answer">Short Answer (Subjective)</option>
                  <option value="mcq">MCQ (Objective)</option>
                  <option value="essay">Essay (Subjective)</option>
                  <option value="numerical">Numerical</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-300 mb-1 block">Question Marks</label>
                <input
                  type="number"
                  value={qMarks}
                  onChange={(e) => setQMarks(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={saving || !title}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
          >
            <span>{saving ? 'Creating...' : 'Create & Save Assessment Draft'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAssessmentPage;
