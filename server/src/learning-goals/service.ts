import { dataRepository } from '../repositories/data.repository.js';
import { GoalProgressCalculator } from './progress.js';
import { CreateGoalInput, UpdateGoalInput } from './types.js';
import { DeterministicAchievementEngine } from '../ai/achievements/engine.js';

export class GoalService {
  public static async createGoal(studentId: string, input: CreateGoalInput): Promise<any> {
    const defaultUnitMap: Record<string, string> = {
      mastery: '% mastery',
      practice_questions: 'questions',
      practice_accuracy: '% accuracy',
      study_minutes: 'minutes',
      study_streak: 'days',
      topic_completion: 'topics',
      custom: 'units',
    };

    const targetDate = new Date(input.targetDate);
    const unit = input.unit || defaultUnitMap[input.goalType] || 'units';

    const goalData = {
      studentId,
      title: input.title.trim(),
      description: input.description?.trim() || '',
      goalType: input.goalType,
      targetValue: Math.max(1, input.targetValue),
      currentValue: 0,
      unit,
      targetDate,
      status: 'active' as const,
      progressPercent: 0,
    };

    const created = await dataRepository.createStudentGoal(goalData);

    // Initial progress evaluation
    const updated = await this.recalculateGoalProgress(studentId, created._id || created.id);
    return updated || created;
  }

  public static async recalculateGoalProgress(studentId: string, goalId: string): Promise<any> {
    const goal = await dataRepository.getStudentGoalById(studentId, goalId);
    if (!goal || goal.status === 'paused' || goal.status === 'expired') {
      return goal;
    }

    const { currentValue, progressPercent, isCompleted } = await GoalProgressCalculator.calculateGoalProgress(
      studentId,
      goal
    );

    const updates: any = {
      currentValue,
      progressPercent,
      updatedAt: new Date(),
    };

    if (isCompleted && goal.status !== 'completed') {
      updates.status = 'completed';
      updates.completedAt = new Date();
    }

    const updatedGoal = await dataRepository.updateStudentGoal(studentId, goalId, updates);

    // Evaluate Achievements upon goal update or completion
    await DeterministicAchievementEngine.evaluateAndGrantAchievements(studentId);

    return updatedGoal;
  }

  public static async recalculateAllStudentGoals(studentId: string): Promise<any[]> {
    const goals = await dataRepository.getStudentGoals(studentId);
    const updatedGoals: any[] = [];
    for (const g of goals || []) {
      const gId = g._id || g.id;
      const updated = await this.recalculateGoalProgress(studentId, gId);
      updatedGoals.push(updated);
    }
    return updatedGoals;
  }
}
