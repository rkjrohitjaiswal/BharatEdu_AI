import mongoose from 'mongoose';

// Disable command buffering so queries fail/fallback immediately when disconnected
mongoose.set('bufferCommands', false);

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!mongoURI) {
    if (isProduction) {
      throw new Error('❌ FATAL: MONGODB_URI must be configured in production mode. Refusing silent in-memory fallback.');
    }
    console.warn('⚠️ MONGODB_URI is not set in environment variables. Running in-memory auth mode.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000, // Quick timeout if MongoDB is offline
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (isProduction) {
      throw new Error(`❌ FATAL: MongoDB connection failed in production mode: ${(error as Error).message}`);
    }
    console.warn(`⚠️ MongoDB connection warning: ${(error as Error).message}. Running with in-memory auth fallback.`);
  }
};

export const isDBConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
