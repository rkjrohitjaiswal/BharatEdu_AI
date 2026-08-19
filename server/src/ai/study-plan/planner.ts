import { dataRepository } from '../../repositories/data.repository.js';
import { StudyPlanRulesEngine } from './rules.js';
import { StudyPlanAIEnricher } from './ai-enricher.js';
import { GeneratedStudyPlanPayload, GeneratedStudyTaskPayload, StudyPlanGenerateOptions } from './types.js';

export class StudyPlanGenerator {
  /**
   * Generates a personalized daily or weekly study plan based on student's actual learning state
   */
  public static async generateStudyPlan(
    studentId: string,
    options: StudyPlanGenerateOptions = {}
  ): Promise<GeneratedStudyPlanPayload> {
    const dailyStudyMinutes = options.dailyStudyMinutes || 60;
    const duration = options.planDuration || 'daily';
    const language = options.preferredLanguage || 'english';

    // 1. Fetch Student Learning State from Repository
    const [studentProfile, learningProfile, masteries, learningGaps, allSubjects] = await Promise.all([
      dataRepository.getStudentProfile(studentId),
      dataRepository.getLearningProfile(studentId),
      dataRepository.getTopicMastery(studentId),
      dataRepository.getLearningGaps(studentId),
      dataRepository.getAllSubjects(),
    ]);

    const studentName = studentProfile?.name || 'Student';
    const recommendedTopics = learningProfile?.recommendedTopics || [];

    // 2. Deterministic Topic Prioritization
    const prioritizedTopics = StudyPlanRulesEngine.prioritizeTopics(
      masteries || [],
      learningGaps || [],
      recommendedTopics || [],
      allSubjects || []
    );

    // If no candidate topics found, fallback to recommended or default subject topics
    if (prioritizedTopics.length === 0) {
      prioritizedTopics.push({
        topicId: 'default_topic_algebra',
        topicName: 'Algebraic Expressions & Identities',
        subjectId: 'sub_math_8',
        subjectName: 'Mathematics',
        priorityScore: 50,
        priorityLevel: 'medium',
        activityType: 'learn',
        suggestedMinutes: 30,
        reason: 'Recommended core topic for Class 8 Mathematics.',
      });
    }

    // 3. Time Allocation Bounds
    const allocatedItems = StudyPlanRulesEngine.allocateTime(prioritizedTopics, dailyStudyMinutes, duration);

    // 4. Pedagogical Reason Enrichment via AI (or deterministic template fallback)
    const { enrichedTasks, aiEnriched } = await StudyPlanAIEnricher.enrichTaskReasons(
      allocatedItems,
      studentName,
      language
    );

    // 5. Construct Tasks Payload
    const now = new Date();
    const tasksPayload: GeneratedStudyTaskPayload[] = enrichedTasks.map((item, index) => {
      let taskTitle = `${item.topicName} — ${item.activityType.toUpperCase()}`;
      if (item.activityType === 'learn') taskTitle = `Learn ${item.topicName}`;
      else if (item.activityType === 'practice') taskTitle = `Practice ${item.topicName}`;
      else if (item.activityType === 'tutor') taskTitle = `Ask AI Tutor about ${item.topicName}`;
      else if (item.activityType === 'revision') taskTitle = `Revise ${item.topicName}`;
      else if (item.activityType === 'review') taskTitle = `Review ${item.topicName}`;

      // Schedule date (multi-day offset for weekly plan)
      const scheduledDate = new Date(now);
      if (duration === 'weekly' && index > 1) {
        const dayOffset = Math.floor(index / 2);
        scheduledDate.setDate(scheduledDate.getDate() + dayOffset);
      }

      return {
        topicId: item.topicId,
        title: taskTitle,
        taskType: item.activityType,
        estimatedMinutes: item.suggestedMinutes,
        scheduledDate,
        completed: false,
        reason: item.reason,
        priority: item.priorityLevel,
      };
    });

    const totalEstimatedMinutes = tasksPayload.reduce((sum, t) => sum + t.estimatedMinutes, 0);
    const planTitle = duration === 'weekly' ? "Personalized Weekly Study Roadmap" : "Today's Targeted Study Schedule";
    const planDescription = `Tailored ${duration} plan for Class ${studentProfile?.classLevel || 8} focusing on active gaps and weak concepts.`;

    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + (duration === 'weekly' ? 7 : 1));

    return {
      title: planTitle,
      description: planDescription,
      targetDate,
      goals: learningProfile?.learningGoals || ['Improve topic mastery above 80%', 'Clear active learning gaps'],
      tasks: tasksPayload,
      status: 'active',
      metadata: {
        totalEstimatedMinutes,
        dailyMinutesLimit: dailyStudyMinutes,
        duration,
        generatedAt: now,
        aiEnriched,
      },
    };
  }
}
