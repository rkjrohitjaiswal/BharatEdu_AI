import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SkeletonLoader } from '../components/SkeletonLoader';
import {
  fetchStudentGoals,
  createStudentGoal,
  pauseStudentGoal,
  resumeStudentGoal,
  deleteStudentGoal,
} from '../services/api';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalEmptyState } from '../components/goals/GoalEmptyState';
import { CreateGoalModal } from '../components/goals/CreateGoalModal';
import { Plus, Target, CheckCircle2 } from 'lucide-react';

export const StudentGoalsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [goals, setGoals] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    const res = await fetchStudentGoals();
    if (res.success && res.data) {
      setGoals(res.data);
    }
    setLoading(false);
  };

  const handleCreateGoal = async (input: any) => {
    const res = await createStudentGoal(input);
    if (res.success) {
      await loadGoals();
    }
  };

  const handlePauseGoal = async (id: string) => {
    const res = await pauseStudentGoal(id);
    if (res.success) await loadGoals();
  };

  const handleResumeGoal = async (id: string) => {
    const res = await resumeStudentGoal(id);
    if (res.success) await loadGoals();
  };

  const handleDeleteGoal = async (id: string) => {
    const res = await deleteStudentGoal(id);
    if (res.success) await loadGoals();
  };

  if (loading) return <SkeletonLoader />;

  const activeGoals = goals.filter((g) => g.status === 'active' || g.status === 'paused');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  return (
    <div className="space-y-6 text-xs max-w-5xl mx-auto">
      <PageHeader
        title="Student Learning Goals"
        description="Set personalized target goals, track progress, and build continuous study momentum."
        actions={
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Create New Goal
          </Button>
        }
      />

      {goals.length === 0 ? (
        <GoalEmptyState onOpenCreate={() => setIsModalOpen(true)} />
      ) : (
        <div className="space-y-6">
          {/* Active Goals Section */}
          <Card title="Active & In-Progress Goals" subtitle="Current study targets">
            {activeGoals.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No active goals. Create a new goal to start tracking!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGoals.map((g) => (
                  <GoalCard
                    key={g._id || g.id}
                    goal={g}
                    onPause={handlePauseGoal}
                    onResume={handleResumeGoal}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Completed Goals Section */}
          {completedGoals.length > 0 && (
            <Card title="Completed Goals" subtitle="Milestones reached!">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedGoals.map((g) => (
                  <GoalCard key={g._id || g.id} goal={g} onDelete={handleDeleteGoal} />
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Modal */}
      <CreateGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateGoal}
      />
    </div>
  );
};
