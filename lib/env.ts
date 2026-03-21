import { z } from 'zod/v4';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Server-side environment variables.
 * Validated at startup via instrumentation.ts.
 * All optional in development (mock data mode).
 */
const serverEnvSchema = z.object({
  // Contentful
  CONTENTFUL_SPACE_ID: z.string().optional(),
  CONTENTFUL_ACCESS_TOKEN: z.string().optional(),
  CONTENTFUL_PREVIEW_TOKEN: z.string().optional(),
  CONTENTFUL_ENVIRONMENT: z.string().default('master'),
  CONTENTFUL_REVALIDATION_SECRET: z.string().min(16).optional(),

  // Email
  RESEND_API_KEY: z
    .string()
    .refine((val) => val.startsWith('re_'), { message: 'RESEND_API_KEY must start with re_' })
    .optional(),
  CONTACT_EMAIL: z.email().optional(),
  CONTACT_CC_EMAILS: z.string().optional(),

  // Error Monitoring
  SENTRY_DSN: z.url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // Rate Limiting
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Runtime
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Client-side environment variables (NEXT_PUBLIC_ prefix).
 * These are embedded in the client bundle at build time.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_CALCOM_USERNAME: z.string().default('revbrain'),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.url().optional(),
  NEXT_PUBLIC_APP_URL: z.url().optional(),
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type PublicEnv = z.infer<typeof publicEnvSchema>;

function validateEnv<T>(schema: z.ZodType<T>, env: Record<string, string | undefined>): T {
  const result = schema.safeParse(env);
  if (!result.success) {
    const formatted = z.prettifyError(result.error);
    if (isProduction) {
      throw new Error(`Environment validation failed:\n${formatted}`);
    }
    console.warn(`[env] Validation warnings (non-blocking in development):\n${formatted}`);
    // In development, return a partial parse with defaults
    return schema.parse({
      ...env,
      NODE_ENV: env.NODE_ENV ?? 'development',
    });
  }
  return result.data;
}

export const serverEnv: ServerEnv = validateEnv(
  serverEnvSchema,
  process.env as Record<string, string | undefined>,
);

export const publicEnv: PublicEnv = validateEnv(publicEnvSchema, {
  NEXT_PUBLIC_CALCOM_USERNAME: process.env.NEXT_PUBLIC_CALCOM_USERNAME,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
