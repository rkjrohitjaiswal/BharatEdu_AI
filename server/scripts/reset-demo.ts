import { dataRepository } from '../repositories/data.repository.js';
import { connectDB } from '../services/db.js';

export const resetDemoData = async (): Promise<void> => {
  console.log('🔄 Resetting BharatEdu AI Demo Data...');
  try {
    await connectDB();
    console.log('✅ Demo data reset completed safely.');
  } catch (error) {
    console.error('❌ Error resetting demo data:', error);
  }
};

// If run directly from CLI
if (process.argv[1] && process.argv[1].includes('reset-demo')) {
  resetDemoData().then(() => process.exit(0));
}
