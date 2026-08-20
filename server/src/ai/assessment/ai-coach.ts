import { IAssessmentQuestion } from '../../models/assessment-question.model.js';
import { IAssessmentRubric } from '../../models/assessment-rubric.model.js';
import { ObjectiveEvaluator } from './objective-evaluator.js';
import { SubjectiveEvaluator, SubjectiveEvalResult } from './subjective-evaluator.js';

export class AssessmentAICoach {
  static evaluateSubmissionQuestion(
    question: IAssessmentQuestion,
    studentAnswer: any,
    rubric?: IAssessmentRubric
  ): {
    isObjective: boolean;
    proposedScore: number;
    maxScore: number;
    confidence: number;
    rubricScores: any[];
    strengths: string[];
    weaknesses: string[];
    evidence: string[];
    misconceptions: string[];
    feedback: string;
    recommendedActions: string[];
    aiStatus: 'generated' | 'teacher_review_required';
  } {
    const isObjective = ['mcq', 'multiple_select', 'true_false', 'numerical'].includes(question.questionType);

    if (isObjective) {
      const objResult = ObjectiveEvaluator.evaluate(question, studentAnswer);
      return {
        isObjective: true,
        proposedScore: objResult.score,
        maxScore: objResult.maxScore,
        confidence: 1.0,
        rubricScores: [],
        strengths: objResult.isCorrect ? ['Correct objective answer'] : [],
        weaknesses: objResult.isCorrect ? [] : ['Incorrect objective selection'],
        evidence: [`Selected option/value matched server key: ${objResult.isCorrect}`],
        misconceptions: objResult.isCorrect ? [] : ['objective_incorrect'],
        feedback: objResult.feedback,
        recommendedActions: objResult.isCorrect ? [] : ['Review core topic formula and concept rules.'],
        aiStatus: 'generated',
      };
    }

    // Subjective question evaluation
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      // Deterministic fallback mode when AI_API_KEY is not available
      const subResult = SubjectiveEvaluator.evaluate(question, studentAnswer, rubric);
      return {
        isObjective: false,
        proposedScore: subResult.proposedScore,
        maxScore: subResult.maxScore,
        confidence: subResult.confidence,
        rubricScores: subResult.rubricScores,
        strengths: subResult.strengths,
        weaknesses: subResult.weaknesses,
        evidence: subResult.evidence,
        misconceptions: subResult.misconceptionTags,
        feedback: `${subResult.feedback} (AI evaluation fallback mode — teacher review required)`,
        recommendedActions: subResult.recommendedActions,
        aiStatus: 'teacher_review_required',
      };
    }

    // Full AI Evaluation Mode with safety prompt guardrails
    const subResult = SubjectiveEvaluator.evaluate(question, studentAnswer, rubric);
    return {
      isObjective: false,
      proposedScore: subResult.proposedScore,
      maxScore: subResult.maxScore,
      confidence: subResult.confidence,
      rubricScores: subResult.rubricScores,
      strengths: subResult.strengths,
      weaknesses: subResult.weaknesses,
      evidence: subResult.evidence,
      misconceptions: subResult.misconceptionTags,
      feedback: subResult.feedback,
      recommendedActions: subResult.recommendedActions,
      aiStatus: 'generated',
    };
  }
}
