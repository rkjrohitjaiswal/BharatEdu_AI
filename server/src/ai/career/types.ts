export type SkillLevel = 'strong' | 'developing' | 'needs_work' | 'missing';

export interface CareerSkill {
  name: string;
  keywords: string[];
  weight: number;
  description: string;
  projectIdeas: string[];
}

export interface CareerDefinition {
  id: string;
  title: string;
  description: string;
  skills: CareerSkill[];
}

export interface SkillAssessment extends CareerSkill {
  score: number;
  level: SkillLevel;
  priority: 'critical' | 'high' | 'medium' | 'low';
}
