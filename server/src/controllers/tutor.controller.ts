import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dataRepository } from '../repositories/data.repository.js';
import { aiOrchestrator } from '../ai/orchestrator.js';
import { VectorRetriever } from '../rag/retriever.js';

export const createConversation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { title, subjectId, topicId, language } = req.body;

    const conv = await dataRepository.createConversation(req.user.id, {
      title,
      subjectId,
      topicId,
      language: language || req.user.preferredLanguage || 'english',
    });

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: conv,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const conversations = await dataRepository.getConversations(req.user.id);

    res.status(200).json({
      success: true,
      data: conversations || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getConversationById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const conversation = await dataRepository.getConversationById(req.user.id, id);

    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found or access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const deleted = await dataRepository.deleteConversation(req.user.id, id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Conversation not found or access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const addMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { content, subjectId, topicId, language } = req.body;

    // 1. Input Validation
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Message content is required and cannot be empty' });
      return;
    }

    if (content.trim().length > 1000) {
      res.status(400).json({
        success: false,
        message: 'Message length exceeds maximum allowed limit of 1000 characters',
      });
      return;
    }

    // 2. Ownership Verification
    const conv = await dataRepository.getConversationById(req.user.id, id);
    if (!conv) {
      res.status(404).json({ success: false, message: 'Conversation not found or access denied' });
      return;
    }

    // 3. Save Student Message
    const updatedConvAfterStudentMsg = await dataRepository.addMessageToConversation(req.user.id, id, {
      role: 'student',
      content: content.trim(),
    });

    const studentMsgObj = updatedConvAfterStudentMsg.messages[updatedConvAfterStudentMsg.messages.length - 1];

    // 4. Retrieve Compact Student Context
    const studentProfile = await dataRepository.getStudentProfile(req.user.id);
    const learningProfile = await dataRepository.getLearningProfile(req.user.id);

    const maxContextMessages = Number(process.env.MAX_CONTEXT_MESSAGES) || 10;
    const recentMessages = (conv.messages || []).slice(-maxContextMessages).map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    // 5. RAG Retrieval Step (Fetch grounded educational sources)
    const subjectName = conv.subjectId?.name || undefined;
    const retrievedSources = await VectorRetriever.retrieveRelevantSources(content.trim(), {
      subject: subjectName,
      language: (language || conv.language || req.user.preferredLanguage || 'english') as any,
      classLevel: studentProfile?.classLevel || 8,
    });

    const tutorContext = {
      studentId: req.user.id,
      studentName: req.user.name,
      classLevel: studentProfile?.classLevel || 8,
      preferredLanguage: (language || conv.language || req.user.preferredLanguage || 'english') as any,
      subjectName,
      topicName: conv.topicId?.name || undefined,
      learningGoals: learningProfile?.learningGoals || [],
      strengths: learningProfile?.strengths || [],
      weaknesses: learningProfile?.weaknesses || [],
      recentMessages,
      retrievedSources,
    };

    // 6. Process Request via AI Orchestrator
    const orchestratorRes = await aiOrchestrator.processTutorRequest({
      conversationId: id,
      studentMessage: content.trim(),
      language: tutorContext.preferredLanguage,
      subjectId: subjectId || conv.subjectId?._id,
      topicId: topicId || conv.topicId?._id,
      context: tutorContext,
    });

    // Attach actual retrieved source metadata (never invented)
    const finalSources = (retrievedSources || []).map((src) => ({
      title: src.title,
      publisher: src.publisher,
      sourceUrl: src.sourceUrl,
      page: src.page,
      section: src.section,
    }));

    // 7. Save Tutor Message with Grounded Sources
    const finalConv = await dataRepository.addMessageToConversation(req.user.id, id, {
      role: 'tutor',
      content: orchestratorRes.answer,
      sources: finalSources,
      metadata: {
        ...(orchestratorRes.metadata || {}),
        rag: {
          used: finalSources.length > 0,
          sourceCount: finalSources.length,
        },
      },
    });

    const tutorMsgObj = finalConv.messages[finalConv.messages.length - 1];

    res.status(200).json({
      success: true,
      message: orchestratorRes.metadata?.error ? orchestratorRes.answer : 'Tutor response generated successfully',
      data: {
        studentMessage: studentMsgObj,
        tutorMessage: tutorMsgObj,
        conversation: finalConv,
      },
    });
  } catch (error) {
    next(error);
  }
};
