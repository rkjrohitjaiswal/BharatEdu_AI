import { IParentRecommendation, IParentWeeklyPlanDay, ParentCopilotStudentSnapshot } from './types.js';

export function evaluateDeterministicParentRecommendations(
  snapshot: ParentCopilotStudentSnapshot
): {
  parentFriendlyExplanation: string;
  recommendedHomeSupportActions: IParentRecommendation[];
  weeklySupportPlan: IParentWeeklyPlanDay[];
} {
  const actions: IParentRecommendation[] = [];
  const focusTopics: string[] = [];

  // 1. Critical/High Risk
  if (snapshot.riskLevel === 'critical' || snapshot.riskLevel === 'high') {
    const mainArea = snapshot.areasRequiringAttention[0] || 'core concepts';
    actions.push({
      priority: 'HIGH',
      reason: `${snapshot.studentName} would benefit from a little extra support with ${mainArea} this week.`,
      evidence: `Topic mastery is currently developing and a few learning gaps need attention.`,
      parentAction: `Encourage 15–20 minutes of relaxed daily practice on ${mainArea}.`,
    });
    focusTopics.push(mainArea);
  }

  // 2. Critical Learning Gaps
  if (snapshot.topLearningGaps.length > 0) {
    snapshot.topLearningGaps.slice(0, 3).forEach((gap) => {
      actions.push({
        priority: gap.severity === 'critical' ? 'HIGH' : 'MEDIUM',
        reason: `${gap.topicName} is a great area to practice together.`,
        evidence: `Concept clarification flagged for ${gap.topicName}.`,
        parentAction: `Ask ${snapshot.studentName} to explain ${gap.topicName} in their own words or review the summary together.`,
      });
      if (!focusTopics.includes(gap.topicName)) {
        focusTopics.push(gap.topicName);
      }
    });
  }

  // 3. Repeated Misconceptions / Mistakes
  if (snapshot.repeatedMistakes.length > 0) {
    const topMistake = snapshot.repeatedMistakes[0];
    actions.push({
      priority: 'MEDIUM',
      reason: `Reviewing past mistake notes on ${topMistake.concept || 'practice questions'} will boost confidence.`,
      evidence: `Student encountered tricky questions in ${topMistake.concept || 'math'}.`,
      parentAction: `Suggest checking the mistake notebook for 10 minutes before starting practice.`,
    });
  }

  // 4. Exam Urgency
  if (snapshot.examReadiness !== undefined && snapshot.examReadiness < 60) {
    actions.push({
      priority: 'HIGH',
      reason: `An upcoming exam prep is scheduled soon.`,
      evidence: `Exam readiness score is ${snapshot.examReadiness}%.`,
      parentAction: `Help set up a quiet, comfortable study space and review the exam topic schedule together.`,
    });
  }

  // 5. Study Plan Non-Adherence
  if (snapshot.studyPlanProgress.totalTasks > 0 && snapshot.studyPlanProgress.adherence < 50) {
    actions.push({
      priority: 'MEDIUM',
      reason: `Maintaining a steady daily study routine helps build long-term momentum.`,
      evidence: `Completed ${snapshot.studyPlanProgress.completedTasks} of ${snapshot.studyPlanProgress.totalTasks} study plan tasks.`,
      parentAction: `Remind ${snapshot.studentName} to check off today's AI Learning Coach schedule.`,
    });
  }

  // Default fallback action
  if (actions.length === 0) {
    actions.push({
      priority: 'LOW',
      reason: `${snapshot.studentName} is demonstrating steady learning progress!`,
      evidence: `Overall topic mastery is ${snapshot.overallMastery}%.`,
      parentAction: `Offer positive praise and encourage taking an advanced practice challenge.`,
    });
  }

  const topic1 = focusTopics[0] || 'Daily Practice';
  const topic2 = focusTopics[1] || topic1;

  // Weekly Home Support Plan (Monday to Friday)
  const weeklySupportPlan: IParentWeeklyPlanDay[] = [
    {
      day: 'Monday',
      activity: `Review current focus topic (${topic1}) and offer positive encouragement.`,
      focusTopic: topic1,
    },
    {
      day: 'Tuesday',
      activity: `Encourage a 15-minute practice session on BharatEdu AI.`,
      focusTopic: topic1,
    },
    {
      day: 'Wednesday',
      activity: `Ask ${snapshot.studentName} to explain one new concept learned today.`,
      focusTopic: 'Mistake Review',
    },
    {
      day: 'Thursday',
      activity: `Check in on daily study-plan completion and teacher tasks.`,
      focusTopic: topic2,
    },
    {
      day: 'Friday',
      activity: `Celebrate this week's effort and review learning achievements together!`,
      focusTopic: 'Weekly Progress Review',
    },
  ];

  const parentFriendlyExplanation =
    `${snapshot.studentName} is showing an overall mastery level of ${snapshot.overallMastery}% with a ${snapshot.riskTrend} learning trend. ` +
    `Encouraging a consistent daily routine of 15–20 minutes will help strengthen key topics and maintain positive momentum.`;

  return {
    parentFriendlyExplanation,
    recommendedHomeSupportActions: actions,
    weeklySupportPlan,
  };
}
