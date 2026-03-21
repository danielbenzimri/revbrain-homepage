'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from '@/lib/contact-schema';

interface ContactFormProps {
  locale: 'he' | 'en';
}

const labels = {
  he: {
    name: 'שם מלא',
    email: 'אימייל',
    company: 'חברה',
    phone: 'טלפון (אופציונלי)',
    message: 'הודעה',
    consent: 'אני מסכים/ה שתיצרו איתי קשר',
    submit: 'שלח הודעה',
    sending: 'שולח...',
    success: 'ההודעה נשלחה בהצלחה! נחזור אליכם בהקדם.',
    error: 'שגיאה בשליחה. אנא נסו שוב או שלחו מייל ל-hello@revbrain.ai',
  },
  en: {
    name: 'Full Name',
    email: 'Email',
    company: 'Company',
    phone: 'Phone (optional)',
    message: 'Message',
    consent: 'I agree to be contacted',
    submit: 'Send Message',
    sending: 'Sending...',
    success: "Message sent successfully! We'll get back to you soon.",
    error: 'Failed to send. Please try again or email hello@revbrain.ai',
  },
};

export function ContactForm({ locale }: ContactFormProps): React.ReactElement {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const t = labels[locale];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      honeypot: '',
      timestamp: Date.now(),
      consent: undefined,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, timestamp: data.timestamp || Date.now() }),
      });
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-8 text-center">
        <p className="text-lg font-semibold text-primary-700">{t.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Honeypot - hidden from users */}
      <div className="hidden" aria-hidden="true">
        <input type="text" {...register('honeypot')} tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" {...register('timestamp', { valueAsNumber: true })} />

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-neutral-700">
          {t.name}
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-700">
          {t.email}
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="company" className="mb-1 block text-sm font-medium text-neutral-700">
          {t.company}
        </label>
        <input
          id="company"
          type="text"
          {...register('company')}
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-neutral-700">
          {t.phone}
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-neutral-700">
          {t.message}
        </label>
        <textarea
          id="message"
          rows={4}
          {...register('message')}
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          {...register('consent')}
          className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="consent" className="text-sm text-neutral-600">
          {t.consent}
        </label>
      </div>
      {errors.consent && <p className="text-sm text-red-500">{errors.consent.message}</p>}

      {status === 'error' && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{t.error}</div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
      >
        {status === 'sending' ? t.sending : t.submit}
      </button>
    </form>
  );
}
