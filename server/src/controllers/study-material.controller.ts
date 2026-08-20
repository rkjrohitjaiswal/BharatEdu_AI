import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  archiveStudyMaterial,
  generateStudyMaterial,
  generateStudyMaterialFlashcards,
  getParentStudentStudyMaterialSummary,
  getRecommendedStudyMaterials,
  getStudyMaterialById,
  getStudyMaterialFlashcards,
  getStudyMaterialHistory,
  getStudyMaterialSummary,
  getTeacherStudentStudyMaterialSummary,
  getTodayStudyMaterials,
  regenerateStudyMaterial,
  reviewStudyFlashcard,
} from '../ai/study-material/service.js';

export const handleGenerate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const material = await generateStudyMaterial(studentId, req.body);
    res.status(201).json({ success: true, data: material });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate study material' });
  }
};

export const handleGetRecommended = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const materials = await getRecommendedStudyMaterials(studentId);
    res.status(200).json({ success: true, data: materials });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch recommended study materials' });
  }
};

export const handleGetToday = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const materials = await getTodayStudyMaterials(studentId);
    res.status(200).json({ success: true, data: materials });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch today study materials' });
  }
};

export const handleGetById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const material = await getStudyMaterialById(studentId, req.params.id);
    if (!material) {
      res.status(404).json({ error: 'Study material not found' });
      return;
    }

    res.status(200).json({ success: true, data: material });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch study material details' });
  }
};

export const handleRegenerate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const material = await regenerateStudyMaterial(studentId, req.params.id);
    res.status(200).json({ success: true, data: material });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to regenerate study material' });
  }
};

export const handleArchive = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const material = await archiveStudyMaterial(studentId, req.params.id);
    res.status(200).json({ success: true, data: material });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to archive study material' });
  }
};

export const handleGetFlashcards = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const flashcards = await getStudyMaterialFlashcards(studentId, req.params.id);
    res.status(200).json({ success: true, data: flashcards });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch study material flashcards' });
  }
};

export const handleGenerateFlashcards = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const flashcards = await generateStudyMaterialFlashcards(studentId, req.params.id);
    res.status(201).json({ success: true, data: flashcards });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate flashcards' });
  }
};

export const handleReviewFlashcard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { outcome } = req.body;
    if (!outcome || !['again', 'hard', 'good', 'easy'].includes(outcome)) {
      res.status(400).json({ error: 'Invalid outcome rating' });
      return;
    }

    const result = await reviewStudyFlashcard(studentId, req.params.id, outcome);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to review flashcard' });
  }
};

export const handleGetHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const history = await getStudyMaterialHistory(studentId);
    res.status(200).json({ success: true, data: history });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch study material history' });
  }
};

export const handleGetSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const summary = await getStudyMaterialSummary(studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch study material summary' });
  }
};

export const handleGetTeacherStudentSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { studentId } = req.params;
    const summary = await getTeacherStudentStudyMaterialSummary(teacherId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch teacher student study material summary' });
  }
};

export const handleGetParentStudentSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parentId = req.user?.id;
    if (!parentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { studentId } = req.params;
    const summary = await getParentStudentStudyMaterialSummary(parentId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Access denied' });
  }
};
