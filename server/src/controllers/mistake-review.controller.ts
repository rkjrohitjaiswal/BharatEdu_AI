import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dataRepository } from '../repositories/data.repository.js';
import { MistakeExplainer } from '../ai/mistake-review/explainer.js';

export const getStudentMistakes = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const limit = parseInt(req.query.limit as string, 10) || 20;
    const rawMistakes = await dataRepository.getStudentMistakes(req.user.id, limit);

    // Enrich each mistake with AI explainer + RAG citations
    const enrichedMistakes = await Promise.all(
      rawMistakes.map(async (m) => {
        const explanationRes = await MistakeExplainer.explainMistake({
          questionText: m.questionText,
          studentAnswer: m.studentAnswer,
          correctAnswer: m.correctAnswer,
          subjectName: m.subjectName,
          topicName: m.topicName,
          storedExplanation: m.storedExplanation,
          language: req.user?.preferredLanguage || 'english',
        });

        return {
          ...m,
          explanation: explanationRes.explanation,
          keyConcept: explanationRes.keyConcept,
          misconception: explanationRes.misconception,
          recommendedAction: explanationRes.recommendedAction,
          sources: explanationRes.sources || [],
        };
      })
    );

    res.status(200).json({
      success: true,
      data: enrichedMistakes || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getMistakeDetails = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { attemptId } = req.params;
    const mistakes = await dataRepository.getStudentMistakes(req.user.id, 50);
    const targetMistake = mistakes.find((m) => String(m._id || m.id) === String(attemptId));

    if (!targetMistake) {
      res.status(404).json({ success: false, message: 'Mistake record not found or access denied' });
      return;
    }

    const explanationRes = await MistakeExplainer.explainMistake({
      questionText: targetMistake.questionText,
      studentAnswer: targetMistake.studentAnswer,
      correctAnswer: targetMistake.correctAnswer,
      subjectName: targetMistake.subjectName,
      topicName: targetMistake.topicName,
      storedExplanation: targetMistake.storedExplanation,
      language: req.user?.preferredLanguage || 'english',
    });

    res.status(200).json({
      success: true,
      data: {
        ...targetMistake,
        explanation: explanationRes.explanation,
        keyConcept: explanationRes.keyConcept,
        misconception: explanationRes.misconception,
        recommendedAction: explanationRes.recommendedAction,
        sources: explanationRes.sources || [],
      },
    });
  } catch (error) {
    next(error);
  }
};
