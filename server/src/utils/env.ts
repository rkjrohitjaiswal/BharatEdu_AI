/**
 * Environment Variable Validator for BharatEdu AI Server
 * Validates critical environment secrets and configuration parameters on startup.
 */

export interface EnvValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

export const validateEnv = (): EnvValidationResult => {
  const warnings: string[] = [];
  const errors: string[] = [];

  const isProduction = process.env.NODE_ENV === 'production';

  // 1. JWT Secret Check
  if (!process.env.JWT_SECRET) {
    if (isProduction) {
      errors.push('JWT_SECRET is missing in production environment!');
    } else {
      warnings.push('JWT_SECRET is not set. Using default development secret key.');
    }
  }

  // 2. MongoDB URI Check
  if (!process.env.MONGODB_URI) {
    if (isProduction) {
      errors.push('MONGODB_URI is missing in production environment!');
    } else {
      warnings.push('MONGODB_URI is not set. Running in development in-memory fallback mode.');
    }
  }

  // 3. AI Provider Check
  if (!process.env.AI_API_KEY) {
    warnings.push('AI_API_KEY is not set. AI Tutor and OpenAI completions will operate in unconnected fallback mode.');
  }

  // Log validation report
  if (warnings.length > 0) {
    warnings.forEach((w) => console.warn(`⚠️ [EnvValidation] ${w}`));
  }

  if (errors.length > 0) {
    errors.forEach((e) => console.error(`❌ [EnvValidation] ${e}`));
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
};
