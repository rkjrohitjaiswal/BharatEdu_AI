import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dataRepository } from '../repositories/data.repository.js';

export const createIntervention = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      studentId,
      classId,
      subjectId,
      topicId,
      type = 'practice',
      title,
      instructions,
      teacherNote,
      priority = 'medium',
      dueDate,
    } = req.body;

    // Payload validation
    if (!studentId || !title || !instructions) {
      res.status(400).json({ success: false, message: 'studentId, title, and instructions are required' });
      return;
    }

    if (title.length > 200 || instructions.length > 2000 || (teacherNote && teacherNote.length > 2000)) {
      res.status(400).json({ success: false, message: 'Payload field size limits exceeded' });
      return;
    }

    // Verify Teacher owns the Class and Student belongs to the Class
    const teacherClasses = await dataRepository.getTeacherClasses(req.user.id);
    let targetClass = teacherClasses.find((c: any) => String(c._id || c.id) === String(classId));

    if (!targetClass && teacherClasses.length > 0) {
      // Find any class owned by this teacher that contains the student
      targetClass = teacherClasses.find((c: any) =>
        (c.studentIds || []).some((s: any) => String(s._id || s.id || s) === String(studentId))
      );
    }

    if (teacherClasses.length > 0 && !targetClass) {
      res.status(403).json({ success: false, message: 'Access denied. Student does not belong to your authorized classes.' });
      return;
    }

    const intervention = await dataRepository.createIntervention({
      teacherId: req.user.id as any,
      studentId,
      classId: targetClass?._id || classId,
      subjectId,
      topicId,
      type,
      title: title.trim(),
      instructions: instructions.trim(),
      teacherNote: teacherNote ? teacherNote.trim() : undefined,
      priority,
      status: 'assigned',
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Intervention assigned successfully',
      data: intervention,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherInterventions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { classId, studentId, status, priority } = req.query;

    const list = await dataRepository.getTeacherInterventions(req.user.id, {
      classId,
      studentId,
      status,
      priority,
    });

    res.status(200).json({
      success: true,
      data: list || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherInterventionById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const item = await dataRepository.getTeacherInterventionById(req.user.id, id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Intervention not found or access denied' });
      return;
    }

    // Attach current learning context from backend
    const studentMastery = await dataRepository.getTopicMastery(item.studentId?._id || item.studentId);
    const topicMasteryDoc = studentMastery.find(
      (m: any) => String(m.topicId?._id || m.topicId) === String(item.topicId?._id || item.topicId)
    );

    res.status(200).json({
      success: true,
      data: {
        ...item,
        currentMasteryScore: topicMasteryDoc?.masteryScore ?? 50,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeacherIntervention = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { status, dueDate, teacherNote } = req.body;

    const updated = await dataRepository.updateTeacherIntervention(req.user.id, id, {
      ...(status && { status }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
      ...(teacherNote && { teacherNote: teacherNote.trim() }),
    });

    if (!updated) {
      res.status(404).json({ success: false, message: 'Intervention not found or access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Intervention updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherInterventionAnalytics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const analytics = await dataRepository.getTeacherInterventionAnalytics(req.user.id);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

// --- STUDENT HANDLERS ---
export const getStudentInterventions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { status, priority } = req.query;

    const list = await dataRepository.getStudentInterventions(req.user.id, {
      status,
      priority,
    });

    res.status(200).json({
      success: true,
      data: list || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentInterventionById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const item = await dataRepository.getStudentInterventionById(req.user.id, id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Intervention assignment not found or access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudentInterventionStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'in_progress' && status !== 'completed') {
      res.status(400).json({ success: false, message: 'Students may only transition status to in_progress or completed' });
      return;
    }

    const updated = await dataRepository.updateStudentInterventionStatus(req.user.id, id, status);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Intervention assignment not found or access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Intervention status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
