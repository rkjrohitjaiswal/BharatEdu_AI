import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { DocumentIngester } from '../rag/ingestion/ingester.js';
import { dataRepository } from '../repositories/data.repository.js';

export const ingestDocument = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, subject, publisher, content, sections } = req.body;

    if (!title || !subject || (!content && (!sections || sections.length === 0))) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: title, subject, and content or sections are required',
      });
      return;
    }

    const result = await DocumentIngester.ingestDocument(req.body);

    res.status(201).json({
      success: true,
      message: result.skipped
        ? 'Document already exists in RAG knowledge base'
        : `Document ingested successfully into ${result.chunkCount} chunks`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const listDocuments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const docs = await dataRepository.getAllEducationalDocuments();
    res.status(200).json({
      success: true,
      data: docs || [],
    });
  } catch (error) {
    next(error);
  }
};
