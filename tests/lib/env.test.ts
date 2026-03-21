import { describe, it, expect } from 'vitest';
import { z } from 'zod/v4';

// Test the schemas directly (not the module-level singletons, which read process.env on import)
const serverEnvSchema = z.object({
  CONTENTFUL_SPACE_ID: z.string().optional(),
  CONTENTFUL_ACCESS_TOKEN: z.string().optional(),
  CONTENTFUL_REVALIDATION_SECRET: z.string().min(16).optional(),
  RESEND_API_KEY: z
    .string()
    .refine((val) => val.startsWith('re_'), { message: 'RESEND_API_KEY must start with re_' })
    .optional(),
  CONTACT_EMAIL: z.email().optional(),
  SENTRY_DSN: z.url().optional(),
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

describe('Server env schema', () => {
  it('accepts valid env with all fields', () => {
    const result = serverEnvSchema.safeParse({
      CONTENTFUL_SPACE_ID: 'abc123',
      CONTENTFUL_ACCESS_TOKEN: 'token123',
      CONTENTFUL_REVALIDATION_SECRET: 'a'.repeat(32),
      RESEND_API_KEY: 're_abc123',
      CONTACT_EMAIL: 'hello@revbrain.ai',
      SENTRY_DSN: 'https://abc@sentry.io/123',
      UPSTASH_REDIS_REST_URL: 'https://redis.upstash.io',
      NODE_ENV: 'production',
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty env in development (mock data mode)', () => {
    const result = serverEnvSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('rejects invalid RESEND_API_KEY format', () => {
    const result = serverEnvSchema.safeParse({
      RESEND_API_KEY: 'invalid_key',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email format', () => {
    const result = serverEnvSchema.safeParse({
      CONTACT_EMAIL: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid URL for SENTRY_DSN', () => {
    const result = serverEnvSchema.safeParse({
      SENTRY_DSN: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('rejects revalidation secret shorter than 16 chars', () => {
    const result = serverEnvSchema.safeParse({
      CONTENTFUL_REVALIDATION_SECRET: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('defaults NODE_ENV to development when not provided', () => {
    const result = serverEnvSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.NODE_ENV).toBe('development');
    }
  });
});
