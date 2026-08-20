import { IAssessmentQuestion } from '../../models/assessment-question.model.js';
import { IAssessmentRubric } from '../../models/assessment-rubric.model.js';
import { RubricEngine, RubricEvalResult } from './rubric-engine.js';

export interface SubjectiveEvalResult {
  questionId: string;
  proposedScore: number;
  maxScore: number;
  confidence: number;
  rubricScores: {
    criterionId: string;
    criterionName: string;
    assignedScore: number;
    maxScore: number;
    feedback?: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  evidence: string[];
  misconceptionTags: string[];
  feedback: string;
  recommendedActions: string[];
}

export class SubjectiveEvaluator {
  static evaluate(
    question: IAssessmentQuestion,
    studentAnswer: any,
    rubric?: IAssessmentRubric
  ): SubjectiveEvalResult {
    const questionId = question.questionId;
    const maxScore = question.marks || 5;
    const expectedPoints = question.expectedPoints || [];
    const answerText = String(studentAnswer || '').trim();

    if (!answerText) {
      return {
        questionId,
        proposedScore: 0,
        maxScore,
        confidence: 0.95,
        rubricScores: [],
        strengths: [],
        weaknesses: ['No response submitted by student.'],
        evidence: ['Empty response field.'],
        misconceptionTags: ['incomplete_response'],
        feedback: 'No answer submitted for this subjective question.',
        recommendedActions: ['Review topic fundamentals and submit attempt.'],
      };
    }

    const lowerText = answerText.toLowerCase();
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const evidence: string[] = [];
    const misconceptionTags: string[] = [];
    let matchesCount = 0;

    // Check expected points matches
    for (const pt of expectedPoints) {
      const lowerPt = pt.toLowerCase();
      const keywords = lowerPt.split(' ').filter((w) => w.length > 3);
      const matched = keywords.some((k) => lowerText.includes(k));
      if (matched) {
        matchesCount++;
        strengths.push(`Identified key concept point: "${pt}"`);
        evidence.push(`Found key term match for point "${pt}" in student response.`);
      } else {
        weaknesses.push(`Missing key point: "${pt}"`);
      }
    }

    // Check misconception triggers
    if (answerText.length < 15) {
      weaknesses.push('Answer is overly brief and lacks detailed explanation.');
      misconceptionTags.push('brief_explanation');
    }
    if (lowerText.includes('dont know') || lowerText.includes("don't know")) {
      weaknesses.push('Expressed uncertainty on foundational concepts.');
      misconceptionTags.push('conceptual_gap');
    }

    // Run Rubric Evaluation
    const rubricResult: RubricEvalResult = RubricEngine.evaluateRubric(
      rubric,
      maxScore,
      answerText.length,
      matchesCount,
      expectedPoints.length
    );

    const proposedScore = rubricResult.totalProposedScore;
    const confidence = process.env.AI_API_KEY ? 0.88 : 0.75;

    const feedback =
      strengths.length > 0
        ? `Good progress! ${strengths[0]}. Proposed score: ${proposedScore}/${maxScore}. Subject to teacher final review.`
        : `Proposed score: ${proposedScore}/${maxScore}. Answer provides partial explanation. Subject to teacher final review.`;

    return {
      questionId,
      proposedScore,
      maxScore,
      confidence,
      rubricScores: rubricResult.criterionScores,
      strengths,
      weaknesses,
      evidence,
      misconceptionTags,
      feedback,
      recommendedActions:
        weaknesses.length > 0
          ? ['Review model answer and key concept definitions.']
          : ['Great job! Keep practicing advanced problems.'],
    };
  }
}
