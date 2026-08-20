import { IAssessmentRubric, IRubricCriterion } from '../../models/assessment-rubric.model.js';

export interface CriterionScoreResult {
  criterionId: string;
  criterionName: string;
  assignedScore: number;
  maxScore: number;
  levelName: string;
  feedback?: string;
}

export interface RubricEvalResult {
  totalProposedScore: number;
  maxMarks: number;
  criterionScores: CriterionScoreResult[];
}

export class RubricEngine {
  static evaluateRubric(
    rubric: IAssessmentRubric | undefined,
    questionMaxMarks: number,
    textLength: number,
    hasExpectedPointsMatches: number,
    totalExpectedPoints: number
  ): RubricEvalResult {
    if (!rubric || !rubric.criteria || rubric.criteria.length === 0) {
      // Default single criterion fallback
      const completionRatio = totalExpectedPoints > 0 ? hasExpectedPointsMatches / totalExpectedPoints : 0.7;
      const proposedScore = Math.min(
        questionMaxMarks,
        Math.max(0, Math.round(questionMaxMarks * completionRatio * 100) / 100)
      );

      return {
        totalProposedScore: proposedScore,
        maxMarks: questionMaxMarks,
        criterionScores: [
          {
            criterionId: 'default_crit',
            criterionName: 'Content Completeness & Accuracy',
            assignedScore: proposedScore,
            maxScore: questionMaxMarks,
            levelName: proposedScore / questionMaxMarks >= 0.8 ? 'Excellent' : 'Developing',
            feedback: 'Evaluated based on key concept coverage and response completeness.',
          },
        ],
      };
    }

    const criterionScores: CriterionScoreResult[] = [];
    let sumAssigned = 0;
    let sumMax = 0;

    const completionRatio = totalExpectedPoints > 0 ? hasExpectedPointsMatches / totalExpectedPoints : 0.6;

    for (const crit of rubric.criteria) {
      const maxScore = crit.maxMarks;
      sumMax += maxScore;

      let levelName = 'Developing';
      let scorePercent = 0.5;

      if (completionRatio >= 0.85 && textLength > 40) {
        levelName = 'Excellent';
        scorePercent = 0.95;
      } else if (completionRatio >= 0.6 && textLength > 20) {
        levelName = 'Good';
        scorePercent = 0.75;
      } else if (completionRatio >= 0.3) {
        levelName = 'Developing';
        scorePercent = 0.5;
      } else {
        levelName = 'Beginning';
        scorePercent = 0.2;
      }

      const assignedScore = Math.min(maxScore, Math.max(0, Math.round(maxScore * scorePercent * 100) / 100));
      sumAssigned += assignedScore;

      criterionScores.push({
        criterionId: crit.criterionId,
        criterionName: crit.name,
        assignedScore,
        maxScore,
        levelName,
        feedback: `${crit.name}: Matched level '${levelName}' (${assignedScore}/${maxScore} marks).`,
      });
    }

    // Scale to fit questionMaxMarks if sumMax differs
    let totalProposedScore = sumAssigned;
    if (sumMax > 0 && sumMax !== questionMaxMarks) {
      totalProposedScore = Math.round((sumAssigned / sumMax) * questionMaxMarks * 100) / 100;
    }

    totalProposedScore = Math.min(questionMaxMarks, Math.max(0, totalProposedScore));

    return {
      totalProposedScore,
      maxMarks: questionMaxMarks,
      criterionScores,
    };
  }
}
