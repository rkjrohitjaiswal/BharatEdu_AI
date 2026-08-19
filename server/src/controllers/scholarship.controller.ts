import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dataRepository } from '../repositories/data.repository.js';
import { ScholarshipRecommendationEngine } from '../scholarships/recommendation.engine.js';
import { ScholarshipMatcher } from '../scholarships/matcher.js';
import { ScholarshipSourceService } from '../scholarships/source.service.js';
import { DeadlineService } from '../scholarships/deadline.service.js';

const LEGAL_DISCLAIMER =
  'BharatEdu AI provides matching guidance based on published official criteria. Final eligibility is determined strictly by the official scholarship provider.';

export const getPublicScholarships = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const scholarships = await dataRepository.getAllScholarships();
    const verifiedScholarships = scholarships.map((s) => {
      const statusInfo = ScholarshipSourceService.verifyScholarshipStatus(s);
      return {
        ...s,
        status: statusInfo.status,
        daysRemaining: statusInfo.daysRemaining,
        legalDisclaimer: LEGAL_DISCLAIMER,
      };
    });

    res.status(200).json({
      success: true,
      legalDisclaimer: LEGAL_DISCLAIMER,
      data: verifiedScholarships || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getScholarshipById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const scholarships = await dataRepository.getAllScholarships();
    const item = scholarships.find((s) => String(s._id || s.id) === String(id));

    if (!item) {
      res.status(404).json({ success: false, message: 'Scholarship opportunity not found' });
      return;
    }

    const sources = await dataRepository.getScholarshipSourcesByScholarshipId(id);
    const statusInfo = ScholarshipSourceService.verifyScholarshipStatus(item);

    res.status(200).json({
      success: true,
      legalDisclaimer: LEGAL_DISCLAIMER,
      data: {
        ...item,
        status: statusInfo.status,
        daysRemaining: statusInfo.daysRemaining,
        sources: sources || [],
        legalDisclaimer: LEGAL_DISCLAIMER,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentScholarshipProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const profile = await dataRepository.getStudentScholarshipProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: profile || {
        studentId: req.user.id,
        educationLevel: 'Class 8',
        classLevel: 8,
        board: 'NCERT',
        state: 'All India',
        category: 'General',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const saveStudentScholarshipProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const profile = await dataRepository.upsertStudentScholarshipProfile(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Scholarship profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentMatches = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const [profile, scholarships] = await Promise.all([
      dataRepository.getStudentScholarshipProfile(req.user.id),
      dataRepository.getAllScholarships(),
    ]);

    const activeProfile = profile || {
      studentId: req.user.id,
      classLevel: 8,
      state: 'All India',
      category: 'General',
    };

    const matches = ScholarshipRecommendationEngine.matchAllScholarships(activeProfile, scholarships);

    res.status(200).json({
      success: true,
      legalDisclaimer: LEGAL_DISCLAIMER,
      data: matches || [],
    });
  } catch (error) {
    next(error);
  }
};

export const matchSingleScholarship = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { scholarshipId } = req.body;
    if (!scholarshipId) {
      res.status(400).json({ success: false, message: 'scholarshipId is required' });
      return;
    }

    const [profile, scholarships] = await Promise.all([
      dataRepository.getStudentScholarshipProfile(req.user.id),
      dataRepository.getAllScholarships(),
    ]);

    const targetSch = scholarships.find((s) => String(s._id || s.id) === String(scholarshipId));
    if (!targetSch) {
      res.status(404).json({ success: false, message: 'Scholarship opportunity not found' });
      return;
    }

    const activeProfile = profile || {
      studentId: req.user.id,
      classLevel: 8,
      state: 'All India',
      category: 'General',
    };

    const matchResult = ScholarshipMatcher.matchStudentScholarship(activeProfile, targetSch);

    res.status(200).json({
      success: true,
      legalDisclaimer: LEGAL_DISCLAIMER,
      data: matchResult,
    });
  } catch (error) {
    next(error);
  }
};

// --- DEADLINE ALERTS & SAVED SCHOLARSHIPS (FEATURE 5) ---
export const getScholarshipAlerts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const [profile, scholarships, savedItems] = await Promise.all([
      dataRepository.getStudentScholarshipProfile(req.user.id),
      dataRepository.getAllScholarships(),
      dataRepository.getStudentSavedScholarships(req.user.id),
    ]);

    const activeProfile = profile || {
      studentId: req.user.id,
      classLevel: 8,
      state: 'All India',
      category: 'General',
    };

    const matches = ScholarshipRecommendationEngine.matchAllScholarships(activeProfile, scholarships);
    const savedIds = new Set(
      savedItems.map((s) => String(s._id || s.scholarshipId?._id || s.scholarshipId))
    );
    const schMap = new Map(scholarships.map((s) => [String(s._id || s.id), s]));

    const alerts = matches.map((m: any) => {
      const sch = schMap.get(String(m.scholarshipId)) || m;
      const calc = DeadlineService.calculateDeadlineInfo(sch);
      const isSaved = savedIds.has(String(sch._id || sch.id));

      let alertType = calc.alertType;
      if (isSaved && calc.deadlineStatus === 'urgent') {
        alertType = 'saved_deadline';
      }

      return {
        scholarship: sch,
        matchScore: m.matchScore,
        confidenceScore: m.confidence,
        eligibilitySummary: m.explanation,
        deadline: sch.deadline,
        deadlineType: sch.deadlineType || 'fixed',
        daysRemaining: calc.daysRemaining,
        deadlineStatus: calc.deadlineStatus,
        alertPriority: calc.alertPriority,
        alertType,
        isSaved,
        legalDisclaimer: LEGAL_DISCLAIMER,
        source: {
          officialUrl: sch.applicationUrl || 'https://scholarships.gov.in',
          verified: calc.isVerified,
          verifiedAt: sch.deadlineVerifiedAt || sch.updatedAt,
        },
      };
    });

    // Filter to active opportunities and sort by alert priority
    const priorityOrder: Record<string, number> = { URGENT: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
    alerts.sort((a, b) => priorityOrder[a.alertPriority] - priorityOrder[b.alertPriority]);

    res.status(200).json({
      success: true,
      legalDisclaimer: LEGAL_DISCLAIMER,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingDeadlines = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { days = '30', limit = '10' } = req.query;
    const daysLimit = parseInt(days as string, 10) || 30;
    const itemLimit = parseInt(limit as string, 10) || 10;

    const [profile, scholarships] = await Promise.all([
      dataRepository.getStudentScholarshipProfile(req.user.id),
      dataRepository.getAllScholarships(),
    ]);

    const activeProfile = profile || {
      studentId: req.user.id,
      classLevel: 8,
      state: 'All India',
      category: 'General',
    };

    const matches = ScholarshipRecommendationEngine.matchAllScholarships(activeProfile, scholarships);
    const schMap = new Map(scholarships.map((s) => [String(s._id || s.id), s]));

    const upcoming = matches
      .map((m: any) => {
        const sch = schMap.get(String(m.scholarshipId)) || m;
        const calc = DeadlineService.calculateDeadlineInfo(sch);
        return {
          scholarship: sch,
          matchScore: m.matchScore,
          deadline: sch.deadline,
          daysRemaining: calc.daysRemaining,
          deadlineStatus: calc.deadlineStatus,
          alertPriority: calc.alertPriority,
          isVerified: calc.isVerified,
          officialUrl: sch.applicationUrl || 'https://scholarships.gov.in',
        };
      })
      .filter((u: any) => {
        if (u.deadlineStatus === 'closed') return false;
        if (u.daysRemaining !== null && u.daysRemaining > daysLimit) return false;
        return true;
      })
      .sort((a: any, b: any) => {
        if (a.daysRemaining === null) return 1;
        if (b.daysRemaining === null) return -1;
        return a.daysRemaining - b.daysRemaining;
      })
      .slice(0, itemLimit);

    res.status(200).json({
      success: true,
      legalDisclaimer: LEGAL_DISCLAIMER,
      data: upcoming,
    });
  } catch (error) {
    next(error);
  }
};

export const saveScholarship = async (
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
    const saved = await dataRepository.saveScholarship(req.user.id, id);

    res.status(200).json({
      success: true,
      message: 'Scholarship saved successfully',
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};

export const unsaveScholarship = async (
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
    await dataRepository.unsaveScholarship(req.user.id, id);

    res.status(200).json({
      success: true,
      message: 'Scholarship removed from saved list',
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedScholarships = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const list = await dataRepository.getStudentSavedScholarships(req.user.id);

    const formatted = list.map((item: any) => {
      const sch = item.scholarshipId || item.scholarship || item;
      const calc = DeadlineService.calculateDeadlineInfo(sch);
      return {
        ...item,
        scholarship: sch,
        daysRemaining: calc.daysRemaining,
        deadlineStatus: calc.deadlineStatus,
        alertPriority: calc.alertPriority,
        officialUrl: sch.applicationUrl || 'https://scholarships.gov.in',
        selfReportedNotice: 'Self-reported application status',
      };
    });

    res.status(200).json({
      success: true,
      legalDisclaimer: LEGAL_DISCLAIMER,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (
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

    const allowedStatuses = ['not_started', 'planning', 'applied', 'submitted', 'closed'];
    if (!status || !allowedStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid application status. Allowed: not_started, planning, applied, submitted, closed',
      });
      return;
    }

    const updated = await dataRepository.updateScholarshipApplicationStatus(req.user.id, id, status);

    res.status(200).json({
      success: true,
      message: `Self-reported application status updated to ${status}`,
      selfReportedNotice: 'Self-reported application status',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
