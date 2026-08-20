import React, { useState } from 'react';
import { generateAIAssessmentEngine, publishTeacherAssessmentEngine } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AssessmentBuilderPage: React.FC = () => {
  const navigate = useNavigate();

  const [subject, setSubject] = useState('Mathematics');
  const [classLevel, setClassLevel] = useState(10);
  const [board, setBoard] = useState('CBSE');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(30);

  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    const res = await generateAIAssessmentEngine({
      subject,
      classLevel: Number(classLevel),
      board,
      totalQuestions: Number(totalQuestions),
      durationMinutes: Number(durationMinutes),
    });

    if (res.success && res.data) {
      setGeneratedData(res.data);
      setStatusMessage('AI generated curriculum-aligned question draft successfully!');
    } else {
      setStatusMessage(res.message || 'Failed to generate assessment draft');
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    if (!generatedData?.assessment?.assessmentId) return;
    setLoading(true);
    const res = await publishTeacherAssessmentEngine(generatedData.assessment.assessmentId);
    if (res.success) {
      navigate('/teacher/assessments');
    } else {
      setStatusMessage(res.message || 'Failed to publish assessment');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/teacher/assessments" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Teacher Assessment Dashboard
        </Link>

        <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-2 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Assessment Builder & Blueprint Generator</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Create Curriculum-Aligned Assessment</h1>
          <p className="text-xs text-slate-400">Generate validated question drafts based on NCERT standards and blueprint specifications.</p>
        </div>

        {statusMessage && (
          <div className="p-3 bg-purple-950/40 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-semibold">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleGenerate} className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Assessment Blueprint Config</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social Studies">Social Studies</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Class Level</label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(Number(e.target.value))}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value={9}>Class 9</option>
                <option value={10}>Class 10</option>
                <option value={11}>Class 11</option>
                <option value={12}>Class 12</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Board</label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="GSEB">GSEB</option>
                <option value="NIOS">NIOS</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Total Questions</label>
              <input
                type="number"
                min={1}
                max={20}
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min={10}
                max={180}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-purple-950/40"
          >
            <Sparkles className="w-4 h-4" /> {loading ? 'Generating Blueprint Draft...' : 'Generate AI Assessment Draft'}
          </button>
        </form>

        {generatedData && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Generated Assessment Questions ({generatedData.questions?.length})</h3>
              <button
                onClick={handlePublish}
                disabled={loading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Publish Assessment
              </button>
            </div>

            <div className="space-y-3">
              {generatedData.questions?.map((q: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400 font-semibold">
                    <span>Q{idx + 1}. {q.topic} ({q.difficulty})</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Validated ({q.marks} Marks)
                    </span>
                  </div>
                  <p className="font-bold text-white">{q.questionText}</p>
                  <p className="text-purple-300">Answer: {q.correctAnswer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentBuilderPage;
