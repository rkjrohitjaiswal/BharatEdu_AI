import { dataRepository } from '../../repositories/data.repository.js';
import { isDBConnected } from '../../services/db.js';
import { LearningPath } from '../../models/learning-path.model.js';
import { getStudentConceptReadinessList, getStudentRootLearningGaps } from '../knowledge-graph/engine.js';
import { STARTER_CURRICULUM_STAGES } from './catalog.js';
import { calculatePathProgress, calculateStudentLearningLevel, selectNextBestConcept } from './rules.js';
import { ILearningPathDTO, ILearningPathStageDTO, ILearningPathSummaryData, ILearningPathTaskDTO } from './types.js';

export async function seedOrRefreshStudentLearningPathEngine(studentId: string): Promise<string> {
  const existingPaths = await dataRepository.getStudentLearningPaths(studentId);
  let pathId = existingPaths?.[0]?._id || existingPaths?.[0]?.id;

  if (!pathId) {
    const newPath = await dataRepository.upsertLearningPath(studentId, 'path_default', {
      title: 'Class 10 CBSE Core Personalized Curriculum',
      description: 'Adaptive long-term learning path designed for CBSE Class 10 Board prep and concept mastery.',
      board: 'CBSE',
      classLevel: 'Class 10',
      targetType: 'general_learning',
      status: 'active',
      progressPercent: 0,
      currentStage: 1,
      totalStages: 6,
      completedStages: 0,
      estimatedTotalMinutes: 290,
      dailyMinutes: 60,
      weeklyMinutes: 420,
    });
    pathId = String(newPath._id || newPath.id || 'path_default');
  }

  // 1. Seed Stages if missing
  const existingStages = await dataRepository.getLearningPathStages(pathId);
  if (!existingStages || existingStages.length === 0) {
    for (const starterStage of STARTER_CURRICULUM_STAGES) {
      const stageObj = await dataRepository.upsertLearningPathStage(
        pathId,
        starterStage.stageIndex,
        {
          studentId,
          stageIndex: starterStage.stageIndex,
          title: starterStage.title,
          description: starterStage.description,
          subject: starterStage.subject,
          conceptIds: starterStage.conceptIds,
          topicIds: starterStage.topicIds,
          prerequisiteConceptIds: starterStage.prerequisiteConceptIds,
          estimatedMinutes: starterStage.estimatedMinutes,
          priority: starterStage.priority,
          status: starterStage.stageIndex === 1 ? 'active' : 'locked',
          masteryRequired: starterStage.masteryRequired,
          currentMastery: 0,
        }
      );

      const stageId = String(stageObj._id || stageObj.id || `stage_${starterStage.stageIndex}`);
      for (const t of starterStage.tasks) {
        await dataRepository.upsertLearningPathTask(pathId, stageId, t.conceptId, {
          studentId,
          taskType: t.taskType,
          title: t.title,
          description: t.description,
          conceptId: t.conceptId,
          topicId: t.topicId,
          resourceId: t.resourceId,
          estimatedMinutes: t.estimatedMinutes,
          priority: starterStage.priority,
          status: 'pending',
        });
      }
    }
  }

  return String(pathId);
}

export async function getStudentLearningPathDetailsEngine(studentId: string): Promise<ILearningPathDTO> {
  const pathId = await seedOrRefreshStudentLearningPathEngine(studentId);
  const paths = await dataRepository.getStudentLearningPaths(studentId);
  const rawPath = paths?.find((p: any) => String(p._id || p.id) === String(pathId)) || paths?.[0];

  const stages = await dataRepository.getLearningPathStages(pathId);
  const tasks = await dataRepository.getLearningPathTasks(pathId);

  // Authoritative Context Aggregation (Features 1–24)
  const rootGaps = await getStudentRootLearningGaps(studentId);
  const readinessList = await getStudentConceptReadinessList(studentId);

  const topGap = rootGaps[0];
  const weakConcept = readinessList.find((r) => r.readinessLevel === 'weak' || r.readinessLevel === 'blocked');

  const nextBestConcept = selectNextBestConcept({
    rootGapConceptId: topGap?.rootGapConceptId,
    rootGapConceptName: topGap?.rootGapConceptName,
    rootGapSubject: topGap?.subject,
    weakConceptId: weakConcept?.conceptId,
    weakConceptName: weakConcept?.conceptName,
    weakConceptSubject: weakConcept?.subject,
  });

  const totalTasksCount = tasks?.length || 0;
  const completedTasksCount = (tasks || []).filter((t: any) => t.status === 'completed').length;
  const completedStagesCount = (stages || []).filter((s: any) => s.status === 'completed').length;

  const totalStagesCount = stages?.length || 6;
  const progressPercent = calculatePathProgress(
    completedStagesCount,
    totalStagesCount,
    completedTasksCount,
    totalTasksCount
  );

  const avgMastery =
    readinessList.length > 0
      ? Math.round(readinessList.reduce((acc, curr) => acc + curr.directMastery, 0) / readinessList.length)
      : 50;

  const { level, score } = calculateStudentLearningLevel(avgMastery, completedStagesCount);

  // Current stage calculation
  let currentStage = 1;
  const activeStage = (stages || []).find((s: any) => s.status === 'active' || s.status === 'available');
  if (activeStage) currentStage = activeStage.stageIndex;

  const dtoStages: ILearningPathStageDTO[] = (stages || [])
    .sort((a: any, b: any) => a.stageIndex - b.stageIndex)
    .map((s: any) => {
      const sId = String(s._id || s.id);
      const stageTasks = (tasks || []).filter((t: any) => String(t.stageId) === sId || t.stageIndex === s.stageIndex);

      return {
        id: sId,
        learningPathId: String(pathId),
        studentId: String(studentId),
        stageIndex: s.stageIndex,
        title: s.title,
        description: s.description,
        subject: s.subject,
        conceptIds: s.conceptIds || [],
        topicIds: s.topicIds || [],
        prerequisiteConceptIds: s.prerequisiteConceptIds || [],
        estimatedMinutes: s.estimatedMinutes || 60,
        priority: s.priority || 'medium',
        status: s.status || 'locked',
        masteryRequired: s.masteryRequired || 75,
        currentMastery: s.currentMastery || 0,
        tasks: stageTasks.map((t: any) => ({
          id: String(t._id || t.id),
          stageId: sId,
          learningPathId: String(pathId),
          studentId: String(studentId),
          taskType: t.taskType || 'learn',
          title: t.title,
          description: t.description,
          conceptId: t.conceptId,
          topicId: t.topicId,
          resourceId: t.resourceId,
          estimatedMinutes: t.estimatedMinutes || 15,
          priority: t.priority || 'medium',
          scheduledDate: t.scheduledDate ? new Date(t.scheduledDate).toISOString() : new Date().toISOString(),
          status: t.status || 'pending',
          completedAt: t.completedAt ? new Date(t.completedAt).toISOString() : undefined,
          actionUrl: `/learning-path`,
          reason: `Core curriculum task for ${t.topicId}.`,
        })),
      };
    });

  return {
    id: String(pathId),
    studentId: String(studentId),
    title: rawPath?.title || 'Class 10 CBSE Core Personalized Curriculum',
    description: rawPath?.description || 'Adaptive curriculum path.',
    board: rawPath?.board || 'CBSE',
    classLevel: rawPath?.classLevel || 'Class 10',
    targetType: rawPath?.targetType || 'general_learning',
    startDate: rawPath?.startDate ? new Date(rawPath.startDate).toISOString() : new Date().toISOString(),
    status: rawPath?.status || 'active',
    progressPercent,
    currentStage,
    totalStages: totalStagesCount,
    completedStages: completedStagesCount,
    estimatedTotalMinutes: rawPath?.estimatedTotalMinutes || 290,
    dailyMinutes: rawPath?.dailyMinutes || 60,
    weeklyMinutes: rawPath?.weeklyMinutes || 420,
    learningLevel: level,
    learningLevelScore: score,
    nextBestConcept,
    stages: dtoStages,
  };
}

export async function getLearningPathSummaryEngine(studentId: string): Promise<ILearningPathSummaryData> {
  const path = await getStudentLearningPathDetailsEngine(studentId);
  const activeStage = path.stages.find((s) => s.stageIndex === path.currentStage);
  const pendingTasks = activeStage?.tasks.filter((t) => t.status === 'pending' || t.status === 'active') || [];

  const todayMin = pendingTasks.reduce((acc, curr) => acc + curr.estimatedMinutes, 0);

  return {
    studentId: String(studentId),
    activePathCount: 1,
    topPathTitle: path.title,
    overallProgressPercent: path.progressPercent,
    currentLearningLevel: path.learningLevel,
    nextBestConceptName: path.nextBestConcept?.conceptName,
    todayTasksCount: pendingTasks.length,
    todayMinutes: todayMin,
    aiAdvice: path.nextBestConcept
      ? `Focus on "${path.nextBestConcept.conceptName}" today. ${path.nextBestConcept.reason}`
      : 'Maintain daily progress on your active learning path.',
    evaluatedAt: new Date().toISOString(),
  };
}
