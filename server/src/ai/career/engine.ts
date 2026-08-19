import { dataRepository } from '../../repositories/data.repository.js';
import { CAREER_CATALOG, findCareer } from './catalog.js';
import { CareerDefinition, SkillAssessment } from './types.js';

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function level(score: number): SkillAssessment['level'] {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'developing';
  if (score > 0) return 'needs_work';
  return 'missing';
}

function priority(score: number): SkillAssessment['priority'] {
  if (score < 35) return 'critical';
  if (score < 60) return 'high';
  if (score < 80) return 'medium';
  return 'low';
}

export async function buildCareerRoadmap(studentId: string, goalId?: string) {
  const goals = await dataRepository.getCareerGoals(studentId);
  const goal = goalId
    ? goals.find((g: any) => String(g._id || g.id) === String(goalId))
    : goals[0];
  if (!goal) throw new Error('Career goal not found');
  const career = findCareer(goal.targetRole);
  if (!career) throw new Error('Unsupported career role');

  const mastery = await dataRepository.getTopicMastery(studentId);

  const assessments: SkillAssessment[] = career.skills.map((skill) => {
    const matches = mastery.filter((m: any) => {
      const topicObjName = typeof m.topicId === 'object' ? (m.topicId?.name || '') : String(m.topicId || '');
      const topicStr = `${topicObjName} ${m.topicName || ''}`.toLowerCase();
      return skill.keywords.some((k) => topicStr.includes(k.toLowerCase()));
    });
    const score = matches.length
      ? clamp(Math.max(...matches.map((m: any) => Number(m.masteryScore ?? 0))))
      : 0;
    return { ...skill, score, level: level(score), priority: priority(score) };
  });

  const totalWeight = assessments.reduce((s, x) => s + x.weight, 0) || 1;
  const readiness = clamp(assessments.reduce((s, x) => s + x.score * x.weight, 0) / totalWeight);
  const ordered = [...assessments].sort((a, b) => a.score - b.score);
  const stages = ordered.filter(s => s.score < 80).map((skill, i) => ({
    order: i + 1,
    skill: skill.name,
    priority: skill.priority,
    currentScore: skill.score,
    objective: `Build ${skill.name} toward 80+ mastery`,
    project: skill.projectIdeas[0],
  }));

  return { goal, career, readiness, skills: assessments, stages, generatedAt: new Date().toISOString() };
}

export function careerCatalog(): CareerDefinition[] { return CAREER_CATALOG; }
