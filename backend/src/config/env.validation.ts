import * as dotenv from 'dotenv';
import * as path from 'path';
import { z } from 'zod';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Environment validation schema
const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z
      .string()
      .regex(/^\d+$/, 'PORT must be a number')
      .transform(Number)
      .default('4000'),

    // Database configuration - support both DATABASE_URL and separate POSTGRES_* variables
    DATABASE_URL: z.string().optional(),
    POSTGRES_USER: z.string().optional(),
    POSTGRES_PASSWORD: z.string().optional(),
    POSTGRES_HOST: z.string().optional(),
    POSTGRES_PORT: z.string().regex(/^\d+$/).transform(Number).optional(),
    POSTGRES_DB: z.string().optional(),

    // JWT configuration
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),

    // Frontend URL for CORS
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  })
  .refine(
    data => {
      // Either DATABASE_URL or all POSTGRES_* variables must be present
      const hasDatabaseUrl = !!data.DATABASE_URL;
      const hasPostgresVars = !!(
        data.POSTGRES_USER &&
        data.POSTGRES_PASSWORD &&
        data.POSTGRES_HOST &&
        data.POSTGRES_PORT &&
        data.POSTGRES_DB
      );
      return hasDatabaseUrl || hasPostgresVars;
    },
    {
      message:
        'Either DATABASE_URL or all POSTGRES_* environment variables must be set',
    },
  );

// Parse and validate environment variables
const parseEnv = () => {
  try {
    const parsed = envSchema.parse(process.env);

    // Build DATABASE_URL from POSTGRES_* variables if not directly provided
    let databaseUrl = parsed.DATABASE_URL;
    if (!databaseUrl && parsed.POSTGRES_USER) {
      databaseUrl = `postgresql://${parsed.POSTGRES_USER}:${parsed.POSTGRES_PASSWORD}@${parsed.POSTGRES_HOST}:${parsed.POSTGRES_PORT}/${parsed.POSTGRES_DB}`;
    }

    return {
      ...parsed,
      DATABASE_URL: databaseUrl!,
      isDevelopment: parsed.NODE_ENV === 'development',
      isProduction: parsed.NODE_ENV === 'production',
      isTest: parsed.NODE_ENV === 'test',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

// Export validated configuration
export const env = parseEnv();

// Type for environment configuration
export type Env = typeof env;
