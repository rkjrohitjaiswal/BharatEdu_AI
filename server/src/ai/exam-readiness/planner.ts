import { ExamReadinessResult, ExamPlan, ExamPlanTask, ExamTaskType } from './types.js';

export class ExamPlanner {
  /**
   * Generates a deterministic exam preparation plan strictly respecting available daily study minutes
   */
  static generateExamPlan(
    readiness: ExamReadinessResult,
    availableDailyMinutes: number = 60
  ): ExamPlan {
    const dailyBudget = Math.max(20, Math.min(180, availableDailyMinutes)); // Bounded 20-180 min
    const planDays = Math.min(14, Math.max(1, readiness.daysRemaining > 0 ? readiness.daysRemaining : 7));

    const tasks: ExamPlanTask[] = [];
    let taskCounter = 1;

    // Collect all topics sorted by priority
    const prioritizedTopics = [
      ...readiness.criticalTopics,
      ...readiness.highPriorityTopics,
    ];

    // If no weak/critical topics, fallback to subject readiness topics
    if (prioritizedTopics.length === 0) {
      readiness.subjectReadiness.forEach((sub) => {
        prioritizedTopics.push({
          topicId: `top_${sub.subjectId}_1`,
          topicName: `${sub.subjectName} Fundamentals`,
          subjectId: sub.subjectId,
          subjectName: sub.subjectName,
          masteryScore: sub.masteryAverage,
          confidenceScore: 0.7,
          readinessLevel: sub.readinessLevel === 'critical' ? 'weak' : 'ready',
          priority: 'medium',
          reason: `Regular study for ${sub.subjectName}`,
          recentMistakesCount: 0,
        });
      });
    }

    for (let day = 1; day <= planDays; day++) {
      let dayAllocatedMinutes = 0;

      // Assign priority tasks to day
      for (const topic of prioritizedTopics) {
        if (dayAllocatedMinutes >= dailyBudget) break;

        const remainingBudget = dailyBudget - dayAllocatedMinutes;
        if (remainingBudget < 10) break;

        let taskType: ExamTaskType = 'practice';
        let estimatedMinutes = Math.min(25, remainingBudget);
        let taskTitle = `Practice ${topic.topicName}`;

        if (topic.priority === 'critical') {
          taskType = 'mistake_review';
          estimatedMinutes = Math.min(20, remainingBudget);
          taskTitle = `Review Mistakes: ${topic.topicName}`;
        } else if (topic.masteryScore < 50) {
          taskType = 'learn';
          estimatedMinutes = Math.min(30, remainingBudget);
          taskTitle = `Learn Core Concepts: ${topic.topicName}`;
        } else if (day === planDays || day % 4 === 0) {
          taskType = 'mock_test';
          estimatedMinutes = Math.min(45, remainingBudget);
          taskTitle = `Mock Test: ${topic.subjectName}`;
        } else {
          taskType = 'revise';
          estimatedMinutes = Math.min(20, remainingBudget);
          taskTitle = `Revision: ${topic.topicName}`;
        }

        tasks.push({
          taskId: `task_ex_${readiness.examId}_d${day}_t${taskCounter++}`,
          subjectId: topic.subjectId,
          subjectName: topic.subjectName,
          topicId: topic.topicId,
          topicName: topic.topicName,
          taskType,
          title: taskTitle,
          estimatedMinutes,
          priority: topic.priority,
          reason: topic.reason,
          scheduledDay: day,
          completed: false,
        });

        dayAllocatedMinutes += estimatedMinutes;
      }

      // If day has remaining budget, add a quick recall task
      if (dayAllocatedMinutes + 10 <= dailyBudget) {
        const recallMinutes = Math.min(15, dailyBudget - dayAllocatedMinutes);
        tasks.push({
          taskId: `task_ex_${readiness.examId}_d${day}_t${taskCounter++}`,
          subjectId: readiness.subjectReadiness[0]?.subjectId || 'sub_1',
          subjectName: readiness.subjectReadiness[0]?.subjectName || 'General',
          topicId: 'top_recall',
          topicName: 'Formula & Key Concepts',
          taskType: 'quick_recall',
          title: 'Quick Formula & Flashcard Recall',
          estimatedMinutes: recallMinutes,
          priority: 'medium',
          reason: 'Daily retention boost',
          scheduledDay: day,
          completed: false,
        });
      }
    }

    return {
      examId: readiness.examId,
      studentId: readiness.studentId,
      generatedAt: new Date().toISOString(),
      availableDailyMinutes: dailyBudget,
      totalDaysInPlan: planDays,
      tasks,
      completionPercentage: 0,
    };
  }
}
