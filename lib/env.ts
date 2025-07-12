import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // App Configuration
  NEXT_PUBLIC_APP_NAME: z.string().default('Next.js i18n Starter'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('https://localhost:3000'),
  NEXT_PUBLIC_APP_DESCRIPTION: z
    .string()
    .default(
      'A modern, production-ready Next.js starter template with internationalization support'
    ),

  // Development
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  // Analytics (Optional)
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),

  // SEO (Optional)
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_YANDEX_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_YAHOO_VERIFICATION: z.string().optional(),

  // Social Media (Optional)
  NEXT_PUBLIC_TWITTER_HANDLE: z.string().optional(),
  NEXT_PUBLIC_GITHUB_USERNAME: z.string().optional(),

  // Error Tracking (Optional)
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // Database (Optional)
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),

  // Authentication (Optional)
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),

  // OAuth Providers (Optional)
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Email Service (Optional)
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  // Feature Flags (Optional)
  NEXT_PUBLIC_FEATURE_FLAG_EXAMPLE: z
    .string()
    .transform(val => val === 'true')
    .default('false'),

  // Build Configuration
  ANALYZE: z
    .string()
    .transform(val => val === 'true')
    .default('false'),
});

// Create a type from the schema
export type Env = z.infer<typeof envSchema>;

// Validate and parse environment variables
function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables');
  }

  return result.data;
}

// Export the validated environment variables
export const env = validateEnv();

// Utility function to check if we're in development
export const isDev = env.NODE_ENV === 'development';

// Utility function to check if we're in production
export const isProd = env.NODE_ENV === 'production';

// Utility function to check if we're in test environment
export const isTest = env.NODE_ENV === 'test';
