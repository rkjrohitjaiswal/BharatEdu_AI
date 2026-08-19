import { IExplainableRecommendation, IWeeklyPlanDay, TeacherCopilotStudentSnapshot } from './types.js';

export function evaluateDeterministicCopilotRecommendations(
  snapshot: TeacherCopilotStudentSnapshot
): {
  recommendedIntervention: string;
  recommendedPracticeTopics: string[];
  recommendedRemediationActions: IExplainableRecommendation[];
  weeklyActionPlan: IWeeklyPlanDay[];
} {
  const actions: IExplainableRecommendation[] = [];
  const practiceTopics: string[] = [];

  // 1. Critical Risk / Critical Gaps
  if (snapshot.riskLevel === 'critical' || snapshot.riskLevel === 'high') {
    const topGap = snapshot.topLearningGaps[0]?.topicName || 'Core Prerequisites';
    actions.push({
      priority: 'URGENT',
      reason: `Student risk level is ${snapshot.riskLevel} (${snapshot.riskReasons[0] || 'low mastery'})`,
      evidence: `Overall mastery is ${snapshot.overallMastery}% with ${snapshot.topLearningGaps.length} active learning gap(s).`,
      action: `Schedule immediate 1-on-1 teacher intervention focusing on ${topGap}.`,
      targetUrl: '/teacher/interventions',
    });
    if (snapshot.topLearningGaps[0]) {
      practiceTopics.push(snapshot.topLearningGaps[0].topicName);
    }
  }

  // 2. Critical Learning Gaps
  if (snapshot.topLearningGaps.length > 0) {
    snapshot.topLearningGaps.slice(0, 3).forEach((gap) => {
      actions.push({
        priority: gap.severity === 'critical' ? 'URGENT' : 'HIGH',
        reason: `Active ${gap.severity} severity learning gap in ${gap.topicName}`,
        evidence: `Concept clarity gap flagged by adaptive engine`,
        action: `Assign targeted practice module for ${gap.topicName}`,
        targetUrl: '/practice',
      });
      if (!practiceTopics.includes(gap.topicName)) {
        practiceTopics.push(gap.topicName);
      }
    });
  }

  // 3. Repeated Misconceptions / Mistakes
  if (snapshot.repeatedMistakes.length > 0) {
    const topMistake = snapshot.repeatedMistakes[0];
    actions.push({
      priority: 'HIGH',
      reason: `Repeated misconception identified in question topic ${topMistake.topicId}`,
      evidence: `Student missed this question type ${topMistake.mistakeCount} time(s)`,
      action: `Review prerequisite solution steps for ${topMistake.concept || 'linear equations'}`,
      targetUrl: '/mistakes',
    });
  }

  // 4. Exam Urgency
  if (snapshot.examReadiness !== undefined && snapshot.examReadiness < 60) {
    actions.push({
      priority: 'HIGH',
      reason: 'Upcoming exam readiness is below threshold',
      evidence: `Exam readiness score is ${snapshot.examReadiness}%`,
      action: 'Assign exam mock test and prioritize high-weightage topics',
      targetUrl: '/exam-prep',
    });
  }

  // 5. Low Practice Accuracy
  if (snapshot.practiceAccuracy > 0 && snapshot.practiceAccuracy < 50) {
    actions.push({
      priority: 'MEDIUM',
      reason: 'Practice accuracy is below 50%',
      evidence: `Practice accuracy is currently ${snapshot.practiceAccuracy}%`,
      action: 'Recommend starting practice at foundational difficulty level',
      targetUrl: '/practice',
    });
  }

  // 6. Study Plan Non-Adherence
  if (snapshot.studyPlanProgress.totalTasks > 0 && snapshot.studyPlanProgress.adherence < 50) {
    actions.push({
      priority: 'MEDIUM',
      reason: 'Study plan task completion rate is below 50%',
      evidence: `Completed ${snapshot.studyPlanProgress.completedTasks} of ${snapshot.studyPlanProgress.totalTasks} tasks`,
      action: 'Encourage student to complete AI Learning Coach daily schedule',
      targetUrl: '/learning-coach',
    });
  }

  // Fallback default action if none triggered
  if (actions.length === 0) {
    actions.push({
      priority: 'LOW',
      reason: 'Student is making steady progress',
      evidence: `Overall mastery is ${snapshot.overallMastery}%`,
      action: 'Assign advanced practice challenges to build mastery depth',
      targetUrl: '/practice',
    });
  }

  // Recommended Intervention Summary
  const primaryAction = actions[0];
  const recommendedIntervention = `Primary Focus: ${primaryAction.action} (Reason: ${primaryAction.reason})`;

  // Derived Dynamic Weekly Action Plan (Monday to Friday)
  const focus1 = practiceTopics[0] || 'Core Concepts';
  const focus2 = practiceTopics[1] || focus1;

  const weeklyActionPlan: IWeeklyPlanDay[] = [
    {
      day: 'Monday',
      task: `Review prerequisite gap in ${focus1}`,
      focusTopic: focus1,
    },
    {
      day: 'Tuesday',
      task: `Assign targeted practice module for ${focus1}`,
      focusTopic: focus1,
    },
    {
      day: 'Wednesday',
      task: `Check mistake notebook and resolve unreviewed misconceptions`,
      focusTopic: 'Mistake Review',
    },
    {
      day: 'Thursday',
      task: `Conduct 1-on-1 teacher check-in or remediation intervention`,
      focusTopic: focus2,
    },
    {
      day: 'Friday',
      task: `Assess weekly progress and verify learning gap resolution`,
      focusTopic: 'Weekly Assessment',
    },
  ];

  return {
    recommendedIntervention,
    recommendedPracticeTopics: practiceTopics.length ? practiceTopics : ['General Practice'],
    recommendedRemediationActions: actions,
    weeklyActionPlan,
  };
}
