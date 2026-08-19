import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { SkeletonLoader } from '../components/SkeletonLoader';
import {
  fetchPracticeHistory,
  fetchPracticeHistorySummary,
  fetchPracticeHistorySessionDetails,
  fetchSubjects,
} from '../services/api';
import { Subject } from '../types';
import {
  History,
  BrainCircuit,
  Target,
  Clock,
  Flame,
  BarChart3,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Bot,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PracticeHistoryPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<any>(null);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, totalPages: 1 });
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Filter States
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Selected Session Detail Modal
  const [selectedSessionDetail, setSelectedSessionDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, [currentPage, selectedSubjectId, selectedDifficulty]);

  const loadData = async () => {
    setLoading(true);
    const [sumRes, histRes, subjRes] = await Promise.all([
      fetchPracticeHistorySummary(),
      fetchPracticeHistory({
        page: currentPage,
        limit: 10,
        subjectId: selectedSubjectId || undefined,
        difficulty: selectedDifficulty || undefined,
      }),
      fetchSubjects(),
    ]);

    if (sumRes.success && sumRes.data) setSummary(sumRes.data);
    if (histRes.success && histRes.data) {
      setHistoryItems(histRes.data.items);
      setPagination(histRes.data.pagination);
    }
    if (subjRes.success && subjRes.data) setSubjects(subjRes.data);
    setLoading(false);
  };

  const handleOpenDetail = async (sessionId: string) => {
    setLoadingDetail(true);
    const res = await fetchPracticeHistorySessionDetails(sessionId);
    if (res.success && res.data) {
      setSelectedSessionDetail(res.data);
    }
    setLoadingDetail(false);
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practice & Quiz History"
        description="Track historical session timelines, accuracy trends, and topic-level quiz performance."
        badge={<Badge variant="purple">Analytics Timeline</Badge>}
      />

      {/* Summary Metrics Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Total Sessions</span>
              <BrainCircuit className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{summary.totalSessions}</p>
            <p className="text-[11px] text-slate-400">{summary.completedSessions} completed</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Questions Solved</span>
              <Target className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{summary.totalQuestions}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">{summary.correctAnswers} correct</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Overall Accuracy</span>
              <BarChart3 className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{summary.overallAccuracy}%</p>
            <p className="text-[11px] text-slate-400">Avg session: {summary.averageSessionAccuracy}%</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Practice Time</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{summary.totalPracticeMinutes}m</p>
            <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
              <Flame className="w-3 h-3 fill-amber-500" />
              {summary.currentPracticeStreak} Day Streak
            </p>
          </div>
        </div>
      )}

      {/* Subject Performance Breakdown */}
      {summary && summary.subjectPerformance && summary.subjectPerformance.length > 0 && (
        <Card title="Subject Performance Summary" subtitle="Historical accuracy breakdown across subjects">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {summary.subjectPerformance.map((sp: any) => (
              <div key={sp.subjectId} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span>{sp.subjectName}</span>
                  <Badge variant="blue" size="sm">{sp.accuracy}% Accuracy</Badge>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-600 h-full" style={{ width: `${sp.accuracy}%` }} />
                </div>
                <p className="text-[11px] text-slate-500">
                  {sp.totalSessions} sessions • {sp.totalQuestions} questions
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filter Bar */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="font-bold text-slate-700">Subject:</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setCurrentPage(1);
              }}
              className="p-2 border border-slate-300 rounded-lg bg-white text-xs"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <label className="font-bold text-slate-700 ml-2">Difficulty:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentPage(1);
              }}
              className="p-2 border border-slate-300 rounded-lg bg-white text-xs"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="intermediate">Intermediate</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <Link to="/practice">
            <Button size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />}>
              Start New Practice
            </Button>
          </Link>
        </div>
      </Card>

      {/* History Session Cards List */}
      {historyItems.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-xs text-slate-500 space-y-3">
            <History className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-800 text-sm">No Practice History Found</p>
            <p className="text-slate-400">You haven't completed any practice sessions matching your filters yet.</p>
            <Link to="/practice">
              <Button size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />}>
                Start First Practice
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div
              key={item.sessionId}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-purple-300 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{item.topicName}</h4>
                  <Badge variant="purple" size="sm">{item.subjectName}</Badge>
                  <Badge variant="slate" size="sm">{item.difficulty}</Badge>
                </div>
                <p className="text-slate-500">
                  Completed on {new Date(item.completedAt || item.startedAt).toLocaleDateString('en-IN')} •{' '}
                  <strong>{item.completedQuestions}/{item.totalQuestions}</strong> Questions
                </p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600">{item.accuracy}%</p>
                  <p className="text-[10px] text-slate-400">Accuracy</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleOpenDetail(item.sessionId)}>
                  View Details
                </Button>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 text-xs">
              <span className="text-slate-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  icon={<ChevronLeft className="w-3.5 h-3.5" />}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  icon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Session Details Modal */}
      {selectedSessionDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto border border-slate-200 shadow-xl">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{selectedSessionDetail.topicName}</h3>
                <p className="text-xs text-slate-500">{selectedSessionDetail.subjectName} • {selectedSessionDetail.difficulty} difficulty</p>
              </div>
              <button
                onClick={() => setSelectedSessionDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Session Stats Header */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-lg font-bold text-emerald-600">{selectedSessionDetail.accuracy}%</p>
                <p className="text-[10px] text-slate-400 font-semibold">Accuracy Score</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-lg font-bold text-slate-800">
                  {selectedSessionDetail.correctAnswers}/{selectedSessionDetail.completedQuestions}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold">Correct Answers</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-lg font-bold text-purple-600">{selectedSessionDetail.difficulty}</p>
                <p className="text-[10px] text-slate-400 font-semibold">Difficulty Level</p>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-900">Question Results Review</h4>
              {selectedSessionDetail.questions.map((q: any, qIdx: number) => (
                <div key={qIdx} className={`p-3 rounded-xl border ${q.isCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'} space-y-1.5`}>
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-bold text-slate-900">Q{qIdx + 1}: "{q.questionText}"</p>
                    {q.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span>Your Answer: <strong>{q.studentAnswer || 'N/A'}</strong></span>
                    {q.correctAnswer && <span>Correct Answer: <strong className="text-emerald-700">{q.correctAnswer}</strong></span>}
                  </div>
                  {q.feedback && <p className="text-[11px] text-slate-600 italic mt-1">{q.feedback}</p>}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Link to="/mistakes">
                <Button size="sm" variant="outline" icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}>
                  Review Mistakes
                </Button>
              </Link>
              <Link to="/tutor">
                <Button size="sm" variant="outline" icon={<Bot className="w-3.5 h-3.5 text-purple-600" />}>
                  Ask AI Tutor
                </Button>
              </Link>
              <Link to="/practice">
                <Button size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />}>
                  Practice Again
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
