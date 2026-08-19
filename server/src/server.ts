import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { connectDB } from './services/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { securityHeaders } from './middleware/security.middleware.js';
import { validateEnv } from './utils/env.js';

// Load environment variables
dotenv.config();

// Validate Environment Secrets & Config
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration (production restricted vs dev flexible)
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const corsOptions: cors.CorsOptions = {
  origin: process.env.NODE_ENV === 'production' ? allowedOrigin : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 BharatEdu AI Server running on port ${PORT}`);
    console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
  });
};

startServer();

export default app;
