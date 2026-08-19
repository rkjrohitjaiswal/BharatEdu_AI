import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dataRepository } from '../repositories/data.repository.js';
import { buildCareerRoadmap, careerCatalog } from '../ai/career/engine.js';
import { generateCareerAdvice } from '../ai/career/ai-coach.js';
import { findCareer } from '../ai/career/catalog.js';

const ok = (res: Response, data: unknown) => res.json({ success: true, data });
const fail = (res: Response, status: number, message: string) => res.status(status).json({ success: false, message });

export async function listCareers(_req: AuthenticatedRequest, res: Response, _next: NextFunction) { return ok(res, careerCatalog()); }

export async function createGoal(req: AuthenticatedRequest, res: Response) {
  const studentId = req.user!.id;
  const { targetRole, targetDate, notes } = req.body ?? {};
  if (!targetRole || typeof targetRole !== 'string' || !findCareer(targetRole)) return fail(res, 400, 'A supported targetRole is required');
  const goal = await dataRepository.createCareerGoal(studentId, { targetRole, targetDate, notes });
  return res.status(201).json({ success: true, data: goal });
}

export async function listGoals(req: AuthenticatedRequest, res: Response) {
  const goals = await dataRepository.getCareerGoals(req.user!.id);
  return ok(res, goals);
}

export async function getRoadmap(req: AuthenticatedRequest, res: Response) {
  try { return ok(res, await buildCareerRoadmap(req.user!.id, req.params.id)); }
  catch (error: any) { return fail(res, 404, error?.message || 'Career roadmap unavailable'); }
}

export async function getAdvice(req: AuthenticatedRequest, res: Response) {
  try { return ok(res, await generateCareerAdvice(req.user!.id, req.params.id)); }
  catch (error: any) { return fail(res, 404, error?.message || 'Career advice unavailable'); }
}

export async function deleteGoal(req: AuthenticatedRequest, res: Response) {
  const deleted = await dataRepository.deleteCareerGoal(req.user!.id, req.params.id);
  if (!deleted) return fail(res, 404, 'Career goal not found');
  return ok(res, { deleted: true });
}
