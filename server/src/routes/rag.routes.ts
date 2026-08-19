import { Router } from 'express';
import { ingestDocument, listDocuments } from '../controllers/rag.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// RAG document ingestion restricted to teacher/admin role or dev testing
router.use(authenticateJWT, requireRole('teacher'));

router.post('/documents', ingestDocument);
router.get('/documents', listDocuments);

export default router;
