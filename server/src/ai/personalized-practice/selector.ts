import { AdaptiveQuestionSelection, PracticeContext, QuestionCandidate } from './types.js';

export function rankAndSelectQuestion(
  candidates: QuestionCandidate[],
  context: PracticeContext,
  targetConceptId: string,
  targetDifficulty: string
): AdaptiveQuestionSelection | null {
  if (!candidates || candidates.length === 0) return null;

  const scoredCandidates = candidates.map((q) => {
    let conceptScore = 0;
    if (q.conceptId === targetConceptId) conceptScore = 25;
    else if (context.weakConceptIds.includes(q.conceptId)) conceptScore = 20;

    let masteryScore = 0;
    if (context.weakConceptIds.includes(q.conceptId)) masteryScore = 20;
    else if (context.prerequisiteGaps.includes(q.conceptId)) masteryScore = 18;

    let difficultyScore = 0;
    if (q.difficulty === targetDifficulty) difficultyScore = 15;
    else difficultyScore = 5;

    let examScore = 0;
    if (q.examTags && q.examTags.some((t) => context.examCriticalConcepts.includes(t))) examScore = 10;

    let mistakeScore = 0;
    if (context.recentMistakeConcepts.includes(q.conceptId)) mistakeScore = 10;

    let pathScore = q.conceptId === context.nextConceptId ? 5 : 2;
    let revisionScore = context.dueRevisionConceptIds.includes(q.conceptId) ? 5 : 2;
    let goalCareerScore = (q.careerTags && q.careerTags.some((t) => context.careerTags.includes(t))) ? 5 : 2;
    let qualityScore = Math.min(5, Math.round((q.qualityScore || 80) / 20));

    const totalScore = Math.min(
      100,
      conceptScore + masteryScore + difficultyScore + examScore + mistakeScore + pathScore + revisionScore + goalCareerScore + qualityScore
    );

    return {
      candidate: q,
      score: totalScore,
      breakdown: {
        conceptScore,
        masteryScore,
        difficultyScore,
        examScore,
        mistakeScore,
        pathScore,
        revisionScore,
        goalCareerScore,
        qualityScore,
      },
    };
  });

  scoredCandidates.sort((a, b) => b.score - a.score);
  const best = scoredCandidates[0];

  return {
    selectedQuestion: best.candidate,
    score: best.score,
    rankingBreakdown: best.breakdown,
    selectionReason: `Selected question matching concept ${targetConceptId} at ${targetDifficulty} difficulty with score ${best.score}/100`,
  };
}
