import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal('')),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal('')),
  SUPER_ADMIN_USER_ID: z.string().optional().or(z.literal('')),
  SUPER_ADMIN_EMAIL: z.string().optional().or(z.literal('')),
  DEMO_MODE: z.enum(['true', 'false']).default('false'),
  LLM_API_KEY: z.string().optional().or(z.literal('')),
  OCR_PROVIDER: z.string().optional().or(z.literal('')),
  OCR_API_KEY: z.string().optional().or(z.literal('')),
    LLM_MODEL: z.string().optional().or(z.literal('')),
  OCR_ENDPOINT: z.string().url().optional().or(z.literal('')),
  OCR_MODEL_ID: z.string().optional().or(z.literal('')),
  PAYMENT_PROVIDER: z.string().optional().or(z.literal('')),
  ELECTRICITY_DATA_PROVIDER: z.string().optional().or(z.literal('')),
  ELECTRICITY_API_URL: z.string().url().optional().or(z.literal('')),
  ELECTRICITY_API_KEY: z.string().optional().or(z.literal('')),
  PAYMENT_KEY_ID: z.string().optional().or(z.literal('')),
  PAYMENT_KEY_SECRET: z.string().optional().or(z.literal('')),
  PAYMENT_WEBHOOK_SECRET: z.string().optional().or(z.literal('')),
  STRIPE_SECRET_KEY: z.string().optional().or(z.literal('')),
  BBPS_API_KEY: z.string().optional().or(z.literal(''))
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  SUPER_ADMIN_USER_ID: process.env.SUPER_ADMIN_USER_ID ?? '',
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL ?? '',
  DEMO_MODE: process.env.DEMO_MODE ?? 'false',
  LLM_API_KEY: process.env.LLM_API_KEY ?? '',
  OCR_PROVIDER: process.env.OCR_PROVIDER ?? '',
  OCR_API_KEY: process.env.OCR_API_KEY ?? '',
    LLM_MODEL: process.env.LLM_MODEL ?? '',
  OCR_ENDPOINT: process.env.OCR_ENDPOINT ?? '',
  OCR_MODEL_ID: process.env.OCR_MODEL_ID ?? '',
  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER ?? '',
  ELECTRICITY_DATA_PROVIDER: process.env.ELECTRICITY_DATA_PROVIDER ?? '',
  ELECTRICITY_API_URL: process.env.ELECTRICITY_API_URL ?? '',
  ELECTRICITY_API_KEY: process.env.ELECTRICITY_API_KEY ?? '',
  PAYMENT_KEY_ID: process.env.PAYMENT_KEY_ID ?? '',
  PAYMENT_KEY_SECRET: process.env.PAYMENT_KEY_SECRET ?? '',
  PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET ?? '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
  BBPS_API_KEY: process.env.BBPS_API_KEY ?? ''
});
