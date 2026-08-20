export interface ISyllabusCoverage {
  coveredConcepts: string[];
  uncoveredConcepts: string[];
  coveragePercent: number;
  sourceDisclaimer: string;
}

export function analyzeSyllabusCoverage(
  board: string,
  classLevel: string,
  subject: string,
  testedConceptIds: string[]
): ISyllabusCoverage {
  const allCurriculumConcepts = [
    'math_linear_eq',
    'math_algebra_basics',
    'math_quadratic_eq',
    'math_triangles',
    'math_trig_ratios',
  ];

  const covered = testedConceptIds.filter((c) => allCurriculumConcepts.includes(c));
  const uncovered = allCurriculumConcepts.filter((c) => !testedConceptIds.includes(c));
  const coveragePercent = Math.round((covered.length / allCurriculumConcepts.length) * 100);

  return {
    coveredConcepts: covered,
    uncoveredConcepts: uncovered,
    coveragePercent,
    sourceDisclaimer: `Exam paper generated using BharatEdu Internal Curriculum Catalog for ${board} ${classLevel} ${subject}.`,
  };
}
