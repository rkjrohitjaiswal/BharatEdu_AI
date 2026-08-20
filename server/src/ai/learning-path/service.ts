import { dataRepository } from '../../repositories/data.repository.js';
import { generateAILearningPathAdvice } from './ai-coach.js';
import { getLearningPathSummaryEngine, getStudentLearningPathDetailsEngine, seedOrRefreshStudentLearningPathEngine } from './engine.js';
import { ILearningPathDTO } from './types.js';

export async function createLearningPath(studentId: string, pathData: any) {
  const newPath = await dataRepository.upsertLearningPath(studentId, `path_${Date.now()}`, {
    title: pathData.title || 'Personalized Curriculum Path',
    description: pathData.description || '',
    targetType: pathData.targetType || 'general_learning',
    status: 'active',
    progressPercent: 0,
    currentStage: 1,
    totalStages: 6,
    completedStages: 0,
    estimatedTotalMinutes: 300,
    dailyMinutes: 60,
    weeklyMinutes: 420,
  });

  await seedOrRefreshStudentLearningPathEngine(studentId);
  return newPath;
}

export async function getStudentLearningPaths(studentId: string) {
  await seedOrRefreshStudentLearningPathEngine(studentId);
  const path = await getStudentLearningPathDetailsEngine(studentId);
  return [path];
}

export async function getLearningPathDetails(studentId: string, pathId?: string): Promise<ILearningPathDTO> {
  const path = await getStudentLearningPathDetailsEngine(studentId);
  const user = await dataRepository.getUserById(studentId);

  const activeStage = path.stages.find((s) => s.stageIndex === path.currentStage);

  const aiAdvice = await generateAILearningPathAdvice(
    user?.name || 'Student',
    activeStage?.title,
    path.nextBestConcept?.conceptName,
    path.nextBestConcept?.reason
  );

  return {
    ...path,
    description: `${path.description} ${aiAdvice}`,
  };
}

export async function getNextLearningTask(studentId: string, pathId?: string) {
  const path = await getStudentLearningPathDetailsEngine(studentId);
  const activeStage = path.stages.find((s) => s.stageIndex === path.currentStage) || path.stages[0];
  const pendingTask = activeStage?.tasks.find((t) => t.status === 'pending' || t.status === 'active') || activeStage?.tasks[0];

  return {
    nextConcept: path.nextBestConcept,
    currentStage: activeStage,
    task: pendingTask || null,
  };
}

export async function refreshStudentLearningPath(studentId: string) {
  await seedOrRefreshStudentLearningPathEngine(studentId);
  return await getLearningPathDetails(studentId);
}

export async function startLearningTask(studentId: string, pathId: string, taskId: string) {
  const tasks = await dataRepository.getLearningPathTasks(pathId);
  const task = (tasks || []).find((t: any) => String(t._id || t.id) === String(taskId));

  if (!task) {
    throw new Error('Task not found');
  }

  return await dataRepository.upsertLearningPathTask(pathId, String(task.stageId), String(task.conceptId), {
    status: 'active',
  });
}

export async function completeLearningTask(studentId: string, pathId: string, taskId: string) {
  const tasks = await dataRepository.getLearningPathTasks(pathId);
  const task = (tasks || []).find((t: any) => String(t._id || t.id) === String(taskId));

  if (!task) {
    throw new Error('Task not found');
  }

  const updatedTask = await dataRepository.upsertLearningPathTask(pathId, String(task.stageId), String(task.conceptId), {
    status: 'completed',
    completedAt: new Date(),
  });

  // Feature 11 Notification Integration (Stage / Task completion alert)
  await dataRepository.createNotification({
    recipientUserId: studentId,
    recipientRole: 'student',
    type: 'LEARNING_PATH_MILESTONE',
    title: `Task Completed: ${task.title}`,
    message: `Great progress! You completed ${task.title} on your learning path.`,
    priority: 'normal',
    sourceType: 'LEARNING_PATH',
  });

  return updatedTask;
}

export async function completeLearningStage(studentId: string, pathId: string, stageId: string) {
  const stages = await dataRepository.getLearningPathStages(pathId);
  const stage = (stages || []).find((s: any) => String(s._id || s.id) === String(stageId) || String(s.stageIndex) === String(stageId));

  if (!stage) {
    throw new Error('Stage not found');
  }

  const updatedStage = await dataRepository.upsertLearningPathStage(pathId, stage.stageIndex, {
    status: 'completed',
    completedAt: new Date(),
    currentMastery: 100,
  });

  // Unlock next stage if available
  const nextStageIndex = stage.stageIndex + 1;
  const nextStage = (stages || []).find((s: any) => s.stageIndex === nextStageIndex);
  if (nextStage) {
    await dataRepository.upsertLearningPathStage(pathId, nextStageIndex, {
      status: 'active',
      startedAt: new Date(),
    });
  }

  return updatedStage;
}

export async function pauseLearningPath(studentId: string, pathId: string) {
  return await dataRepository.upsertLearningPath(studentId, pathId, {
    status: 'paused',
  });
}

export async function resumeLearningPath(studentId: string, pathId: string) {
  return await dataRepository.upsertLearningPath(studentId, pathId, {
    status: 'active',
  });
}

export async function getTeacherStudentLearningPathSummary(teacherId: string, studentId: string) {
  const summary = await getLearningPathSummaryEngine(studentId);

  return {
    studentId,
    summary,
    teacherRecommendation: summary.nextBestConceptName
      ? `Guide student through next concept: "${summary.nextBestConceptName}".`
      : 'Student is making clean progress on their curriculum path.',
  };
}

export async function getParentStudentLearningPathSummary(parentId: string, studentId: string) {
  const isLinked = await dataRepository.isParentLinkedToStudent(parentId, studentId);
  if (!isLinked) {
    throw new Error('Access denied: Parent is not linked to this student');
  }

  const summary = await getLearningPathSummaryEngine(studentId);

  return {
    studentId,
    summary,
    parentExplanation: summary.nextBestConceptName
      ? `Your child is focusing on "${summary.nextBestConceptName}" in Stage ${summary.todayTasksCount > 0 ? '1' : '2'}.`
      : 'Your child is following their personalized learning path.',
  };
}
