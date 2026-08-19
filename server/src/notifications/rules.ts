import { dataRepository } from '../repositories/data.repository.js';
import { NotificationCandidate } from './types.js';

export async function evaluateStudentRules(studentId: string): Promise<NotificationCandidate[]> {
  const candidates: NotificationCandidate[] = [];

  // 1. Study Plan Rules
  try {
    const studyPlan = await dataRepository.getStudyPlan(studentId);
    if (studyPlan?.dailyTasks) {
      const now = new Date();
      studyPlan.dailyTasks.forEach((task: any, idx: number) => {
        if (!task.completed) {
          const taskDate = task.scheduledDate ? new Date(task.scheduledDate) : null;
          if (taskDate && taskDate < now) {
            candidates.push({
              recipientUserId: studentId,
              recipientRole: 'student',
              type: 'overdue_task',
              title: 'Study Task Overdue',
              message: `Your study task "${task.taskTitle || task.title || 'Daily Practice'}" is overdue.`,
              priority: 'high',
              sourceType: 'study_plan',
              sourceId: String(task.taskId || idx),
              actionUrl: '/study-plan',
              dedupeKey: `sp_overdue_${studentId}_${task.taskId || idx}_${taskDate.toISOString().split('T')[0]}`,
            });
          } else if (task.priority === 'high' || task.isCritical) {
            candidates.push({
              recipientUserId: studentId,
              recipientRole: 'student',
              type: 'important_task',
              title: 'Important Study Task Today',
              message: `Don't forget to complete "${task.taskTitle || task.title || 'Targeted Practice'}" today.`,
              priority: 'normal',
              sourceType: 'study_plan',
              sourceId: String(task.taskId || idx),
              actionUrl: '/study-plan',
              dedupeKey: `sp_important_${studentId}_${task.taskId || idx}`,
            });
          }
        }
      });
    }
  } catch (err) {
    // Ignore non-fatal evaluation errors
  }

  // 2. Mistake Review Rules
  try {
    const mistakes = await dataRepository.getMistakesByStudentId(studentId);
    if (Array.isArray(mistakes) && mistakes.length > 0) {
      const unreviewed = mistakes.filter((m: any) => !m.reviewed);
      if (unreviewed.length >= 3) {
        candidates.push({
          recipientUserId: studentId,
          recipientRole: 'student',
          type: 'repeated_misconceptions',
          title: 'Unreviewed Mistake Alert',
          message: `You have ${unreviewed.length} unreviewed mistakes. Review them to build concept clarity.`,
          priority: 'high',
          sourceType: 'mistake_review',
          actionUrl: '/mistakes',
          dedupeKey: `mr_unreviewed_${studentId}_count_${unreviewed.length}`,
        });
      }
    }
  } catch (err) {}

  // 3. Teacher Intervention Rules for Student
  try {
    const interventions = await dataRepository.getStudentInterventions(studentId);
    if (Array.isArray(interventions)) {
      const active = interventions.filter((i: any) => i.status !== 'completed' && i.status !== 'dismissed');
      active.forEach((interv: any) => {
        const intervId = String(interv._id || interv.id);
        const dueDate = interv.dueDate ? new Date(interv.dueDate) : null;
        const now = Date.now();

        if (dueDate && dueDate.getTime() < now) {
          candidates.push({
            recipientUserId: studentId,
            recipientRole: 'student',
            type: 'intervention_overdue',
            title: 'Teacher Task Overdue',
            message: `Overdue task from your teacher: "${interv.title}"`,
            priority: 'critical',
            sourceType: 'intervention',
            sourceId: intervId,
            actionUrl: '/interventions',
            dedupeKey: `interv_overdue_${studentId}_${intervId}`,
          });
        } else {
          candidates.push({
            recipientUserId: studentId,
            recipientRole: 'student',
            type: 'new_intervention',
            title: 'New Teacher Task',
            message: `Your teacher assigned: "${interv.title}"`,
            priority: 'high',
            sourceType: 'intervention',
            sourceId: intervId,
            actionUrl: '/interventions',
            dedupeKey: `interv_assigned_${studentId}_${intervId}`,
          });
        }
      });
    }
  } catch (err) {}

  // 4. Scholarship Rules
  try {
    const profile = await dataRepository.getStudentScholarshipProfile(studentId);
    const scholarships = await dataRepository.getScholarships();
    if (profile && Array.isArray(scholarships)) {
      scholarships.forEach((s: any) => {
        if (s.deadline) {
          const dl = new Date(s.deadline);
          const daysLeft = Math.ceil((dl.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (daysLeft > 0 && daysLeft <= 14) {
            candidates.push({
              recipientUserId: studentId,
              recipientRole: 'student',
              type: 'scholarship_deadline',
              title: 'Scholarship Deadline Approaching',
              message: `"${s.name}" deadline is in ${daysLeft} day(s). Apply soon!`,
              priority: daysLeft <= 5 ? 'critical' : 'high',
              sourceType: 'scholarship',
              sourceId: String(s._id || s.id),
              actionUrl: '/scholarships',
              dedupeKey: `sch_deadline_${studentId}_${s._id || s.id}_${daysLeft <= 5 ? 'urgent' : 'warning'}`,
            });
          }
        }
      });
    }
  } catch (err) {}

  // 5. Student Goals & Achievements
  try {
    const goals = await dataRepository.getStudentGoals(studentId);
    if (Array.isArray(goals)) {
      goals.forEach((g: any) => {
        const gId = String(g._id || g.id);
        if (g.status === 'completed') {
          candidates.push({
            recipientUserId: studentId,
            recipientRole: 'student',
            type: 'goal_completed',
            title: 'Learning Goal Achieved! 🎉',
            message: `Congratulations! You completed your goal: "${g.title}"`,
            priority: 'normal',
            sourceType: 'goal',
            sourceId: gId,
            actionUrl: '/goals',
            dedupeKey: `goal_completed_${studentId}_${gId}`,
          });
        } else if (g.currentProgress >= 80 && g.status !== 'completed') {
          candidates.push({
            recipientUserId: studentId,
            recipientRole: 'student',
            type: 'goal_near_completion',
            title: 'Goal Almost Complete',
            message: `You are at ${g.currentProgress}% for "${g.title}". Keep going!`,
            priority: 'normal',
            sourceType: 'goal',
            sourceId: gId,
            actionUrl: '/goals',
            dedupeKey: `goal_near_${studentId}_${gId}_${Math.floor(g.currentProgress / 10) * 10}`,
          });
        }
      });
    }

    const achievements = await dataRepository.getStudentAchievements(studentId);
    if (Array.isArray(achievements)) {
      achievements.forEach((a: any) => {
        if (a.unlockedAt || a.unlocked) {
          const aId = String(a._id || a.id || a.achievementId);
          candidates.push({
            recipientUserId: studentId,
            recipientRole: 'student',
            type: 'achievement_earned',
            title: 'New Achievement Unlocked! 🏆',
            message: `You earned the "${a.title || a.name || 'Badge'}" achievement!`,
            priority: 'normal',
            sourceType: 'achievement',
            sourceId: aId,
            actionUrl: '/achievements',
            dedupeKey: `ach_unlocked_${studentId}_${aId}`,
          });
        }
      });
    }
  } catch (err) {}

  // 6. Exam Preparation Rules
  try {
    const exams = await dataRepository.getExamPreparations(studentId);
    if (Array.isArray(exams)) {
      exams.forEach((exam: any) => {
        const examId = String(exam._id || exam.id);
        const examDate = new Date(exam.examDate);
        const daysLeft = Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

        if (daysLeft >= 0 && daysLeft <= 14) {
          candidates.push({
            recipientUserId: studentId,
            recipientRole: 'student',
            type: 'exam_approaching',
            title: 'Exam Approaching',
            message: `"${exam.title}" is in ${daysLeft} day(s). Check your readiness plan!`,
            priority: daysLeft <= 3 ? 'critical' : 'high',
            sourceType: 'exam',
            sourceId: examId,
            actionUrl: `/exam-prep/${examId}/readiness`,
            dedupeKey: `exam_approach_${studentId}_${examId}_${daysLeft <= 3 ? 'urgent' : 'soon'}`,
          });
        }
      });
    }
  } catch (err) {}

  // 7. Learning Coach Rules
  try {
    const gaps = await dataRepository.getStudentGaps(studentId);
    if (Array.isArray(gaps)) {
      const activeGaps = gaps.filter((g: any) => g.status === 'active');
      const criticalGaps = activeGaps.filter((g: any) => g.severity === 'critical' || g.severity === 'high');
      if (criticalGaps.length > 0) {
        candidates.push({
          recipientUserId: studentId,
          recipientRole: 'student',
          type: 'critical_learning_gap',
          title: 'Critical Learning Gap Alert',
          message: `You have ${criticalGaps.length} high-priority learning gap(s) identified by AI Coach.`,
          priority: 'critical',
          sourceType: 'learning_coach',
          actionUrl: '/learning-coach',
          dedupeKey: `coach_gap_${studentId}_count_${criticalGaps.length}`,
        });
      }
    }
  } catch (err) {}

  // 8. Career Roadmap Rules
  try {
    const careerGoals = await dataRepository.getCareerGoals(studentId);
    if (Array.isArray(careerGoals) && careerGoals.length > 0) {
      const activeGoal = careerGoals[0];
      const goalId = String(activeGoal._id || activeGoal.id);
      candidates.push({
        recipientUserId: studentId,
        recipientRole: 'student',
        type: 'career_skill_gap',
        title: 'Career Target Update',
        message: `Review your skill progress toward your ${activeGoal.targetRole} target.`,
        priority: 'normal',
        sourceType: 'career',
        sourceId: goalId,
        actionUrl: '/career',
        dedupeKey: `career_update_${studentId}_${goalId}`,
      });
    }
  } catch (err) {}

  return candidates;
}

export async function evaluateTeacherRules(teacherId: string): Promise<NotificationCandidate[]> {
  const candidates: NotificationCandidate[] = [];
  try {
    const classes = await dataRepository.getTeacherClasses(teacherId);
    if (Array.isArray(classes)) {
      classes.forEach((cls: any) => {
        candidates.push({
          recipientUserId: teacherId,
          recipientRole: 'teacher',
          type: 'teacher_class_update',
          title: 'Class Insights Ready',
          message: `Updated learning analytics available for class ${cls.className || cls.name || 'Group'}.`,
          priority: 'normal',
          sourceType: 'system',
          sourceId: String(cls._id || cls.id),
          actionUrl: '/teacher',
          dedupeKey: `teacher_class_${teacherId}_${cls._id || cls.id}`,
        });
      });
    }
  } catch (err) {}
  return candidates;
}

export async function evaluateParentRules(parentId: string): Promise<NotificationCandidate[]> {
  const candidates: NotificationCandidate[] = [];
  try {
    const links = await dataRepository.getParentStudentLinksByParentId(parentId);
    if (Array.isArray(links)) {
      for (const link of links) {
        const studentId = String(link.studentId);
        const student = await dataRepository.getUserById(studentId);
        const studentName = student?.name || 'Your student';

        // Check if student has critical gap or approaching exam
        const gaps = await dataRepository.getStudentGaps(studentId);
        const activeCritical = (gaps || []).filter((g: any) => g.status === 'active' && (g.severity === 'critical' || g.severity === 'high'));
        if (activeCritical.length > 0) {
          candidates.push({
            recipientUserId: parentId,
            recipientRole: 'parent',
            type: 'parent_student_gap_alert',
            title: `Progress Alert: ${studentName}`,
            message: `${studentName} has ${activeCritical.length} active learning gap(s) needing practice support.`,
            priority: 'high',
            sourceType: 'learning_coach',
            sourceId: studentId,
            actionUrl: `/parent/student/${studentId}`,
            dedupeKey: `parent_gap_${parentId}_${studentId}_count_${activeCritical.length}`,
          });
        }
      }
    }
  } catch (err) {}
  return candidates;
}
