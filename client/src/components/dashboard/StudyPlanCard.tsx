import React, { useState } from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { StudyPlanData, StudyPlanTask } from '../../types';
import { CheckSquare, Square, Calendar, Clock, Sparkles, RefreshCw, BookOpen, Bot, Award, ArrowRight } from 'lucide-react';
import { updateStudyTaskStatus, generateStudyPlan } from '../../services/api';
import { Link } from 'react-router-dom';

interface StudyPlanCardProps {
  studyPlan: StudyPlanData | null;
  onPlanUpdated?: (newPlan: StudyPlanData) => void;
}

export const StudyPlanCard: React.FC<StudyPlanCardProps> = ({ studyPlan, onPlanUpdated }) => {
  const [activePlan, setActivePlan] = useState<StudyPlanData | null>(studyPlan);
  const [tasks, setTasks] = useState<StudyPlanTask[]>(studyPlan?.tasks || []);
  const [generating, setGenerating] = useState<boolean>(false);
  const [duration, setDuration] = useState<'daily' | 'weekly'>('daily');
  const [dailyMinutes, setDailyMinutes] = useState<number>(60);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setTasks((prev) =>
      prev.map((t) => (String(t._id || t.id) === String(taskId) ? { ...t, completed: nextStatus } : t))
    );
    await updateStudyTaskStatus(taskId, nextStatus);
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    const res = await generateStudyPlan({
      dailyStudyMinutes: dailyMinutes,
      planDuration: duration,
    });
    setGenerating(false);

    if (res.success && res.data) {
      setActivePlan(res.data);
      setTasks(res.data.tasks || []);
      setShowConfig(false);
      if (onPlanUpdated) onPlanUpdated(res.data);
    }
  };

  const totalMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <Card
      title="Personalized AI Study Plan"
      subtitle={activePlan ? activePlan.title : 'AI-generated daily study checklist'}
      action={
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfig(!showConfig)}
          icon={generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
        >
          {activePlan ? 'Regenerate Plan' : 'Generate Plan'}
        </Button>
      }
    >
      {/* Plan Generation Options Panel */}
      {showConfig && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-3 text-xs">
          <div className="flex justify-between items-center font-bold text-purple-900">
            <span>Study Plan Generator Settings</span>
            <Badge variant="purple" size="sm">AI Adaptive Engine</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Plan Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as 'daily' | 'weekly')}
                className="w-full text-xs p-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="daily">Daily Schedule</option>
                <option value="weekly">Weekly Roadmap</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Daily Study Target (Min)</label>
              <input
                type="number"
                min="15"
                max="300"
                step="15"
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(parseInt(e.target.value, 10) || 60)}
                className="w-full text-xs p-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <Button
            size="sm"
            className="w-full"
            disabled={generating}
            onClick={handleGeneratePlan}
            icon={generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          >
            {generating ? 'Analyzing Learning State...' : 'Generate Target Study Plan'}
          </Button>
        </div>
      )}

      {/* Plan Progress Header */}
      {activePlan && tasks.length > 0 && (
        <div className="mb-3 flex justify-between items-center text-xs text-slate-500 pb-2 border-b border-slate-100">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Total: <strong className="text-slate-800">{totalMinutes} mins</strong>
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Completed: <strong className="text-emerald-700">{completedCount}/{tasks.length}</strong>
          </span>
        </div>
      )}

      {!activePlan || tasks.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500 space-y-2">
          <Calendar className="w-8 h-8 text-purple-300 mx-auto" />
          <p className="font-semibold text-slate-700">No Active Study Plan</p>
          <p className="text-slate-400">Click "Generate Plan" to build a schedule tailored to your learning gaps.</p>
          <Button size="sm" variant="outline" onClick={() => setShowConfig(true)} icon={<Sparkles className="w-3.5 h-3.5" />}>
            Generate Your Plan
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5 text-xs">
          {tasks.map((task) => {
            const taskId = task._id || task.id || '';
            const topicName = typeof task.topicId === 'object' && task.topicId !== null ? task.topicId.name : '';
            const isTutor = task.taskType === 'tutor';

            return (
              <div
                key={taskId}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  task.completed
                    ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                    : 'bg-white border-slate-200 hover:border-emerald-500 text-slate-900 shadow-sm'
                }`}
              >
                <div
                  onClick={() => handleToggleTask(taskId, task.completed)}
                  className="shrink-0 mt-0.5 text-emerald-600 cursor-pointer"
                >
                  {task.completed ? (
                    <CheckSquare className="w-4.5 h-4.5 text-emerald-600" />
                  ) : (
                    <Square className="w-4.5 h-4.5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{task.title}</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0 ml-2">
                      <Clock className="w-3 h-3" />
                      {task.estimatedMinutes}m
                    </span>
                  </div>

                  {topicName && <p className="text-[11px] text-slate-500 no-underline mt-0.5">{topicName}</p>}

                  {/* Task Action Deep-Link */}
                  <div className="mt-2 flex justify-between items-center no-underline">
                    <span className="text-[10px] text-slate-400 italic">
                      {task.completed ? 'Completed' : 'Recommended action'}
                    </span>
                    <Link to={isTutor ? '/tutor' : '/practice'}>
                      <span className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 no-underline">
                        {isTutor ? 'Ask Tutor' : 'Start Practice'}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
