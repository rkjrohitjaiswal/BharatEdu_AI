import { dataRepository } from '../../repositories/data.repository.js';
import { MaterialType } from '../../models/study-material.model.js';
import { getStudentConceptReadinessList, getStudentRootLearningGaps } from '../knowledge-graph/engine.js';
import { getStudentLearningPathDetailsEngine } from '../learning-path/engine.js';
import { generateAIStudyMaterialContent } from './ai-coach.js';
import { determinePersonalizedMaterialRules } from './rules.js';
import { IStudyFlashcardDTO, IStudyMaterialDTO, IStudyMaterialSummaryData } from './types.js';

export async function generateStudentStudyMaterialEngine(
  studentId: string,
  options?: {
    subject?: string;
    topicId?: string;
    conceptId?: string;
    materialType?: MaterialType;
  }
): Promise<IStudyMaterialDTO> {
  const rootGaps = await getStudentRootLearningGaps(studentId);
  const readinessList = await getStudentConceptReadinessList(studentId);
  const learningPath = await getStudentLearningPathDetailsEngine(studentId);
  const studyPlan = await dataRepository.getStudentStudyPlan(studentId);

  const topGap = rootGaps[0];
  const activeConcept = options?.conceptId || learningPath.nextBestConcept?.conceptId || topGap?.rootGapConceptId || 'math_linear_eq';
  const matchingReadiness = readinessList.find((r) => r.conceptId === activeConcept);

  const isPrerequisiteGap = Boolean(matchingReadiness?.isBlocked || (topGap && topGap.rootGapConceptId === activeConcept));
  const masteryScore = matchingReadiness?.directMastery ?? 50;
  const availableMinutes = studyPlan?.availableDailyMinutes || 30;

  const subject = options?.subject || matchingReadiness?.subject || 'Mathematics';
  const conceptName = matchingReadiness?.conceptName || 'Pair of Linear Equations';

  const { recommendedType, difficulty, estimatedMinutes, reason, prerequisiteGapNotice } =
    determinePersonalizedMaterialRules({
      conceptId: activeConcept,
      subject,
      isPrerequisiteGap,
      masteryScore,
      isExamUrgent: false,
      isHighRisk: topGap?.severity === 'critical',
      isRevisionDue: masteryScore < 50,
      availableMinutes,
      requestedType: options?.materialType,
    });

  const { title, content, sections, sourceReferences, generatedBy } = await generateAIStudyMaterialContent(
    subject,
    conceptName,
    recommendedType,
    prerequisiteGapNotice
  );

  const materialId = `mat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const createdMat = await dataRepository.createStudyMaterial({
    materialId,
    studentId,
    title,
    subject,
    classLevel: 'Class 10',
    board: 'CBSE',
    topicIds: [options?.topicId || 'Algebra'],
    conceptIds: [activeConcept],
    learningPathId: learningPath.id,
    stageId: String(learningPath.currentStage),
    materialType: recommendedType,
    difficulty,
    language: 'English',
    estimatedMinutes,
    content,
    sections,
    sourceReferences,
    generatedBy,
    status: 'ready',
  });

  const matDbId = String(createdMat._id || createdMat.id || materialId);

  // Generate Starter Flashcards
  const flashcards: IStudyFlashcardDTO[] = [
    {
      id: `fc_${Date.now()}_1`,
      materialId: matDbId,
      studentId: String(studentId),
      question: `What is the primary condition for ${conceptName}?`,
      answer: `The primary condition requires solving linear equations simultaneously using algebraic or graphical methods.`,
      explanation: `Linear equations must satisfy both equations simultaneously.`,
      conceptId: activeConcept,
      difficulty,
      order: 1,
      status: 'active',
    },
    {
      id: `fc_${Date.now()}_2`,
      materialId: matDbId,
      studentId: String(studentId),
      question: `Which method is recommended when coefficients are simple?`,
      answer: `Substitution method or elimination method.`,
      explanation: `Elimination method minimizes algebraic fraction errors.`,
      conceptId: activeConcept,
      difficulty,
      order: 2,
      status: 'active',
    },
  ];

  for (const fc of flashcards) {
    await dataRepository.createFlashcard(fc);
  }

  return {
    id: matDbId,
    materialId,
    studentId: String(studentId),
    title,
    subject,
    classLevel: 'Class 10',
    board: 'CBSE',
    topicIds: [options?.topicId || 'Algebra'],
    conceptIds: [activeConcept],
    learningPathId: learningPath.id,
    stageId: String(learningPath.currentStage),
    materialType: recommendedType,
    difficulty,
    language: 'English',
    estimatedMinutes,
    content,
    sections,
    sourceReferences,
    generatedBy,
    status: 'ready',
    flashcards,
    createdAt: createdMat.createdAt ? new Date(createdMat.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: createdMat.updatedAt ? new Date(createdMat.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export async function getStudentStudyMaterialsEngine(studentId: string): Promise<IStudyMaterialDTO[]> {
  const existing = await dataRepository.getStudentStudyMaterials(studentId);
  if (!existing || existing.length === 0) {
    const first = await generateStudentStudyMaterialEngine(studentId);
    return [first];
  }

  return (existing || []).map((m: any) => ({
    id: String(m._id || m.id),
    materialId: m.materialId || String(m._id),
    studentId: String(studentId),
    title: m.title,
    subject: m.subject || 'Mathematics',
    classLevel: m.classLevel || 'Class 10',
    board: m.board || 'CBSE',
    topicIds: m.topicIds || [],
    conceptIds: m.conceptIds || [],
    learningPathId: m.learningPathId,
    stageId: m.stageId,
    itemId: m.itemId,
    materialType: m.materialType || 'detailed_notes',
    difficulty: m.difficulty || 'intermediate',
    language: m.language || 'English',
    estimatedMinutes: m.estimatedMinutes || 15,
    content: m.content || '',
    sections: m.sections || [],
    sourceReferences: m.sourceReferences || [],
    generatedBy: m.generatedBy || 'hybrid',
    status: m.status || 'ready',
    createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: m.updatedAt ? new Date(m.updatedAt).toISOString() : new Date().toISOString(),
  }));
}

export async function getStudyMaterialSummaryEngine(studentId: string): Promise<IStudyMaterialSummaryData> {
  const materials = await getStudentStudyMaterialsEngine(studentId);
  const readyMaterials = materials.filter((m) => m.status === 'ready');
  const archivedCount = materials.filter((m) => m.status === 'archived').length;
  const top = readyMaterials[0];

  return {
    studentId: String(studentId),
    totalMaterialsCount: readyMaterials.length,
    todayMaterialsCount: readyMaterials.slice(0, 3).length,
    archivedMaterialsCount: archivedCount,
    topMaterial: top,
    aiExplanation: top
      ? `Active Study Material: "${top.title}". Comprehensive ${top.materialType.replace('_', ' ')} for study session.`
      : 'Generate personalized notes aligned with your Learning Path.',
    evaluatedAt: new Date().toISOString(),
  };
}
