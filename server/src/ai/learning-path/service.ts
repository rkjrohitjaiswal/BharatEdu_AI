import { dataRepository } from '../../repositories/data.repository.js';
import { generateAILearningPathAdvice } from './ai-coach.js';
import { getLearningPathSummaryEngine, getStudentLearningPathDetailsEngine, seedOrRefreshStudentLearningPathEngine } from './engine.js';
import { ILearningPathDTO } from './types.js';

export async function generateLearningPath(studentId: string, pathData?: any) {
  const pathId = await seedOrRefreshStudentLearningPathEngine(studentId);
  if (pathData?.title) {
    await dataRepository.updateLearningPath(pathId, studentId, {
      title: pathData.title,
      description: pathData.description || '',
      targetType: pathData.targetType || 'mastery',
    });
  }
  return await getStudentLearningPathDetailsEngine(studentId);
}

export async function getCurrentLearningPath(studentId: string) {
  await seedOrRefreshStudentLearningPathEngine(studentId);
  return await getStudentLearningPathDetailsEngine(studentId);
}

export async function getLearningPathById(studentId: string, pathId: string) {
  const path = await getStudentLearningPathDetailsEngine(studentId);
  return path;
}

export async function refreshLearningPath(studentId: string, pathId?: string) {
  await seedOrRefreshStudentLearningPathEngine(studentId);
  return await getStudentLearningPathDetailsEngine(studentId);
}

export async function getLearningPathStages(studentId: string, pathId: string) {
  const path = await getStudentLearningPathDetailsEngine(studentId);
  return path.stages;
}

export async function getLearningPathItems(studentId: string, pathId: string) {
  const path = await getStudentLearningPathDetailsEngine(studentId);
  const activeStage = path.stages.find((s) => s.stageIndex === path.currentStage) || path.stages[0];
  return activeStage?.tasks || [];
}

export async function startLearningPathItem(studentId: string, pathId: string, itemId: string) {
  const tasks = await dataRepository.getLearningPathTasks(pathId);
  const cleanId = String(itemId).replace(/^(item_|task_)/, '');
  const task = (tasks || []).find(
    (t: any) => String(t._id || t.id) === String(itemId) || t.conceptId === itemId || t.conceptId === cleanId
  );

  if (!task) {
    return { id: itemId, status: 'active', startedAt: new Date().toISOString() };
  }

  return await dataRepository.upsertLearningPathTask(pathId, String(task.stageId), String(task.conceptId), {
    status: 'active',
  });
}

export async function completeLearningPathItem(studentId: string, pathId: string, itemId: string) {
  const tasks = await dataRepository.getLearningPathTasks(pathId);
  const cleanId = String(itemId).replace(/^(item_|task_)/, '');
  const task = (tasks || []).find(
    (t: any) => String(t._id || t.id) === String(itemId) || t.conceptId === itemId || t.conceptId === cleanId
  );

  if (task) {
    await dataRepository.upsertLearningPathTask(pathId, String(task.stageId), String(task.conceptId), {
      status: 'completed',
      completedAt: new Date(),
    });
  }

  // Feature 11 Notification Integration
  await dataRepository.createNotification({
    recipientUserId: studentId,
    recipientRole: 'student',
    type: 'LEARNING_PATH_MILESTONE',
    title: `Item Completed: ${task?.title || 'Learning Item'}`,
    message: `Great progress on your personalized curriculum path!`,
    priority: 'normal',
    sourceType: 'LEARNING_PATH',
  });

  return { id: itemId, status: 'completed', completedAt: new Date().toISOString() };
}

export async function skipLearningPathItem(studentId: string, pathId: string, itemId: string) {
  const tasks = await dataRepository.getLearningPathTasks(pathId);
  const cleanId = String(itemId).replace(/^(item_|task_)/, '');
  const task = (tasks || []).find(
    (t: any) => String(t._id || t.id) === String(itemId) || t.conceptId === itemId || t.conceptId === cleanId
  );

  if (task) {
    await dataRepository.upsertLearningPathTask(pathId, String(task.stageId), String(task.conceptId), {
      status: 'skipped',
    });
  }

  return { id: itemId, status: 'skipped' };
}

export async function getNextLearningItem(studentId: string, pathId?: string) {
  const path = await getStudentLearningPathDetailsEngine(studentId);
  const activeStage = path.stages.find((s) => s.stageIndex === path.currentStage) || path.stages[0];
  const pendingTask = activeStage?.tasks.find((t) => t.status === 'pending' || t.status === 'active') || activeStage?.tasks[0];

  return {
    nextConcept: path.nextBestConcept,
    currentStage: activeStage,
    item: pendingTask || null,
  };
}

export async function getLearningPathSummary(studentId: string, pathId?: string) {
  return await getLearningPathSummaryEngine(studentId);
}

export async function getLearningPathAdvice(studentId: string, pathId?: string) {
  const path = await getStudentLearningPathDetailsEngine(studentId);
  const user = await dataRepository.getUserById(studentId);

  const activeStage = path.stages.find((s) => s.stageIndex === path.currentStage);

  const adviceText = await generateAILearningPathAdvice(
    user?.name || 'Student',
    activeStage?.title,
    path.nextBestConcept?.conceptName,
    path.nextBestConcept?.reason
  );

  return {
    advice: adviceText,
    nextConcept: path.nextBestConcept,
    currentLevel: path.learningLevel,
  };
}

export async function createLearningPath(studentId: string, pathData: any) {
  return await generateLearningPath(studentId, pathData);
}

export async function getStudentLearningPaths(studentId: string) {
  const path = await getCurrentLearningPath(studentId);
  return [path];
}

export async function getLearningPathDetails(studentId: string, pathId?: string): Promise<ILearningPathDTO> {
  return await getCurrentLearningPath(studentId);
}

export async function getNextLearningTask(studentId: string, pathId?: string) {
  return await getNextLearningItem(studentId, pathId);
}

export async function refreshStudentLearningPath(studentId: string) {
  return await refreshLearningPath(studentId);
}

export async function startLearningTask(studentId: string, pathId: string, taskId: string) {
  return await startLearningPathItem(studentId, pathId, taskId);
}

export async function completeLearningTask(studentId: string, pathId: string, taskId: string) {
  return await completeLearningPathItem(studentId, pathId, taskId);
}

export async function completeLearningStage(studentId: string, pathId: string, stageId: string) {
  const stages = await dataRepository.getLearningPathStages(pathId);
  const stage = (stages || []).find(
    (s: any) => String(s._id || s.id) === String(stageId) || String(s.stageIndex) === String(stageId) || String(s.stageOrder) === String(stageId)
  );

  if (!stage) {
    return { id: stageId, status: 'completed' };
  }

  const updatedStage = await dataRepository.upsertLearningPathStage(pathId, stage.stageIndex, {
    status: 'completed',
    completedAt: new Date(),
    currentMastery: 100,
  });

  const nextStageIndex = stage.stageIndex + 1;
  await dataRepository.upsertLearningPathStage(pathId, nextStageIndex, {
    status: 'active',
    startedAt: new Date(),
  });

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
      ? `Your child is focusing on "${summary.nextBestConceptName}".`
      : 'Your child is following their personalized learning path.',
  };
}
