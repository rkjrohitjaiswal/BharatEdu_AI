import { dataRepository } from '../../repositories/data.repository.js';
import { MaterialType } from '../../models/study-material.model.js';
import {
  generateStudentStudyMaterialEngine,
  getStudentStudyMaterialsEngine,
  getStudyMaterialSummaryEngine,
} from './engine.js';
import { IStudyFlashcardDTO, IStudyMaterialDTO, IStudyMaterialSummaryData } from './types.js';

export async function generateStudyMaterial(
  studentId: string,
  options?: {
    subject?: string;
    topicId?: string;
    conceptId?: string;
    materialType?: MaterialType;
  }
): Promise<IStudyMaterialDTO> {
  return await generateStudentStudyMaterialEngine(studentId, options);
}

export async function getRecommendedStudyMaterials(studentId: string): Promise<IStudyMaterialDTO[]> {
  return await getStudentStudyMaterialsEngine(studentId);
}

export async function getTodayStudyMaterials(studentId: string): Promise<IStudyMaterialDTO[]> {
  const materials = await getStudentStudyMaterialsEngine(studentId);
  return materials.filter((m) => m.status === 'ready').slice(0, 3);
}

export async function getStudyMaterialById(studentId: string, materialId: string): Promise<IStudyMaterialDTO | null> {
  const materials = await getStudentStudyMaterialsEngine(studentId);
  const target = materials.find((m) => m.id === materialId || m.materialId === materialId);
  if (!target) return null;

  const flashcards = await dataRepository.getFlashcards(target.id);
  return { ...target, flashcards };
}

export async function regenerateStudyMaterial(studentId: string, materialId: string): Promise<IStudyMaterialDTO> {
  const existing = await getStudyMaterialById(studentId, materialId);
  return await generateStudentStudyMaterialEngine(studentId, {
    subject: existing?.subject,
    conceptId: existing?.conceptIds[0],
    materialType: existing?.materialType,
  });
}

export async function archiveStudyMaterial(studentId: string, materialId: string) {
  const updated = await dataRepository.archiveStudyMaterial(materialId, studentId);
  return updated || { id: materialId, status: 'archived' };
}

export async function getStudyMaterialFlashcards(studentId: string, materialId: string): Promise<IStudyFlashcardDTO[]> {
  return await dataRepository.getFlashcards(materialId);
}

export async function generateStudyMaterialFlashcards(studentId: string, materialId: string): Promise<IStudyFlashcardDTO[]> {
  const target = await getStudyMaterialById(studentId, materialId);
  const subject = target?.subject || 'Mathematics';
  const conceptId = target?.conceptIds[0] || 'concept_gen';

  const fc1 = await dataRepository.createFlashcard({
    materialId,
    studentId,
    question: `Key formula or concept rule for ${target?.title || subject}?`,
    answer: `Apply structured step-by-step resolution rules for ${subject}.`,
    explanation: `Essential principle for standard problem solving.`,
    conceptId,
    difficulty: 'intermediate',
    order: 1,
    status: 'active',
  });

  const fc2 = await dataRepository.createFlashcard({
    materialId,
    studentId,
    question: `Common error to avoid when working on ${subject}?`,
    answer: `Check sign conventions, algebraic units, and given constraint limits.`,
    explanation: `Minimizes non-conceptual computational mistakes.`,
    conceptId,
    difficulty: 'intermediate',
    order: 2,
    status: 'active',
  });

  return [fc1, fc2];
}

export async function reviewStudyFlashcard(
  studentId: string,
  flashcardId: string,
  outcome: 'again' | 'hard' | 'good' | 'easy'
) {
  const updated = await dataRepository.reviewFlashcard(flashcardId, studentId, outcome);

  // Feature 24 Integration: Record Spaced Repetition Review
  if (updated?.conceptId) {
    const qualityMap = { again: 1, hard: 3, good: 4, easy: 5 };
    const rating = qualityMap[outcome] || 4;
    await dataRepository.addRevisionHistory({
      studentId,
      conceptId: updated.conceptId,
      sessionType: 'flashcard_review',
      rating,
      recallSuccess: outcome !== 'again',
    });
  }

  // Feature 11 Notification Integration
  await dataRepository.createNotification({
    recipientUserId: studentId,
    recipientRole: 'student',
    type: 'STUDY_MATERIAL',
    title: 'Flashcard Reviewed',
    message: `Flashcard review outcome: ${outcome.toUpperCase()}`,
    priority: 'normal',
    sourceType: 'FLASHCARD',
  });

  return updated || { id: flashcardId, outcome, status: 'active' };
}

export async function getStudyMaterialHistory(studentId: string): Promise<IStudyMaterialDTO[]> {
  const materials = await getStudentStudyMaterialsEngine(studentId);
  return materials.filter((m) => m.status === 'archived');
}

export async function getStudyMaterialSummary(studentId: string): Promise<IStudyMaterialSummaryData> {
  return await getStudyMaterialSummaryEngine(studentId);
}

export async function getTeacherStudentStudyMaterialSummary(teacherId: string, studentId: string) {
  const summary = await getStudyMaterialSummary(studentId);
  return {
    studentId,
    summary,
    teacherNote: summary.topMaterial
      ? `Student is reviewing "${summary.topMaterial.title}".`
      : 'Student is engaging with personalized study notes.',
  };
}

export async function getParentStudentStudyMaterialSummary(parentId: string, studentId: string) {
  const isLinked = await dataRepository.isParentLinkedToStudent(parentId, studentId);
  if (!isLinked) {
    throw new Error('Access denied: Parent is not linked to this student');
  }

  const summary = await getStudyMaterialSummary(studentId);
  return {
    studentId,
    summary,
    parentExplanation: summary.topMaterial
      ? `Your child is studying "${summary.topMaterial.title}".`
      : 'Your child is following their personalized study notes.',
  };
}
