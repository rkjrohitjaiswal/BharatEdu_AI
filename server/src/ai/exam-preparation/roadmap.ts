import { ExamPriority, ExamStudyDay, ExamStudyWeek, ExamPreparationTask } from './types.js';

export class ExamRoadmapEngine {
  static generateTodayPlan(
    priorities: ExamPriority[],
    availableDailyMinutes: number = 120
  ): ExamStudyDay {
    const todayStr = new Date().toISOString().split('T')[0];
    const topPriorities = priorities.slice(0, 3);
    const timePerTask = Math.floor(availableDailyMinutes / Math.max(1, topPriorities.length));

    const tasks: ExamPreparationTask[] = topPriorities.map((p, idx) => ({
      taskId: `task_today_${idx}_${Date.now()}`,
      conceptId: p.conceptId,
      topic: p.topic,
      activityType: p.isPrerequisiteGap ? 'prerequisite_repair' : idx === 0 ? 'practice' : 'revision',
      durationMinutes: timePerTask,
      priority: p.isPrerequisiteGap || p.isHighRisk ? 'high' : 'medium',
      reason: p.reason,
      actionUrl: p.isPrerequisiteGap ? `/practice?conceptId=${p.conceptId}` : `/assessments`,
      prerequisiteStatus: p.isPrerequisiteGap ? 'unmet' : 'met',
    }));

    return {
      date: todayStr,
      dayTitle: 'Today',
      totalMinutes: availableDailyMinutes,
      tasks: tasks.length > 0 ? tasks : [
        {
          taskId: 'task_def_1',
          conceptId: 'math_polynomials',
          topic: 'Polynomials & Quadratic Equations',
          activityType: 'practice',
          durationMinutes: 60,
          priority: 'high',
          reason: 'Core high-weightage algebra concept practice.',
          actionUrl: '/assessments',
          prerequisiteStatus: 'met',
        },
      ],
    };
  }

  static generateWeeklyPlan(
    priorities: ExamPriority[],
    availableDailyMinutes: number = 120
  ): ExamStudyWeek {
    const today = new Date();
    const days: ExamStudyDay[] = Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date(today);
      d.setDate(d.getDate() + idx);
      const dateStr = d.toISOString().split('T')[0];

      const p = priorities[idx % priorities.length] || {
        conceptId: 'math_polynomials',
        topic: 'Polynomials',
        reason: 'Syllabus concept practice',
      };

      const dayTitle = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        date: dateStr,
        dayTitle,
        totalMinutes: availableDailyMinutes,
        tasks: [
          {
            taskId: `task_w1_${idx}_1`,
            conceptId: p.conceptId,
            topic: p.topic,
            activityType: idx % 3 === 0 ? 'practice' : idx % 3 === 1 ? 'revision' : 'mock_test',
            durationMinutes: Math.floor(availableDailyMinutes / 2),
            priority: 'high',
            reason: p.reason,
            actionUrl: '/assessments',
            prerequisiteStatus: 'met',
          },
          {
            taskId: `task_w1_${idx}_2`,
            conceptId: 'sci_light_reflection',
            topic: 'Light - Reflection and Refraction',
            activityType: 'resource_study',
            durationMinutes: Math.floor(availableDailyMinutes / 2),
            priority: 'medium',
            reason: 'NCERT diagrams and numerical problem solving.',
            actionUrl: '/resources',
            prerequisiteStatus: 'met',
          },
        ],
      };
    });

    return {
      weekNumber: 1,
      title: 'Current Exam Preparation Sprint',
      days,
    };
  }
}
