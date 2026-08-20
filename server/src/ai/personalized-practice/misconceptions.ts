export interface MisconceptionDiagnosis {
  conceptId: string;
  misconceptionTag: string;
  description: string;
  recommendedPrerequisiteConcept?: string;
  recommendedResourceId?: string;
  actionableAdvice: string;
}

export function diagnoseStudentMisconception(
  conceptId: string,
  selectedAnswer: any,
  correctAnswer: any,
  misconceptionTags: string[] = []
): MisconceptionDiagnosis {
  const tag = misconceptionTags[0] || 'conceptual_misunderstanding';

  let description = `Student made a mistake on concept ${conceptId}.`;
  let advice = 'Review foundational concepts and re-read step-by-step solution steps.';
  let prereq: string | undefined = undefined;
  let resId: string | undefined = 'res_ncert_math_algebra';

  if (tag === 'sign_error_in_factoring') {
    description = 'Confused positive/negative signs when factoring quadratic expression (x - a)(x - b).';
    advice = 'Remember that a positive constant product (+6) with a negative linear term (-5x) requires two negative factors.';
    prereq = 'math_factoring';
  } else if (tag === 'discriminant_formula_error') {
    description = 'Incorrectly applied discriminant formula D = b² - 4ac.';
    advice = 'Verify that b is squared cleanly and 4*a*c is subtracted.';
    prereq = 'math_quadratic_eq';
  }

  return {
    conceptId,
    misconceptionTag: tag,
    description,
    recommendedPrerequisiteConcept: prereq,
    recommendedResourceId: resId,
    actionableAdvice: advice,
  };
}
