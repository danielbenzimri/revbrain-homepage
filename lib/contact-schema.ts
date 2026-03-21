import { z } from 'zod/v4';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.email('Invalid email address'),
  company: z.string().min(1, 'Company is required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  consent: z.literal(true, { message: 'You must agree to be contacted' }),
  honeypot: z.string().max(0).optional(), // Must be empty (spam trap)
  timestamp: z.number().optional(), // For time-to-submit check
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
