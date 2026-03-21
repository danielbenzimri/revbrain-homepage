import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/contact-schema';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request): Promise<NextResponse> {
  // CSRF: validate origin
  const origin = request.headers.get('origin');
  const allowedOrigins = [process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000'].filter(
    Boolean,
  );
  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Validate content type
  const contentType = request.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 415 });
  }

  try {
    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const data = result.data;

    // Honeypot check
    if (data.honeypot && data.honeypot.length > 0) {
      // Silently accept but don't send (bot detected)
      return NextResponse.json({ success: true });
    }

    // Time-to-submit check (reject < 2 seconds)
    if (data.timestamp && Date.now() - data.timestamp < 2000) {
      return NextResponse.json({ success: true }); // Silent rejection
    }

    // Send email via Resend
    if (resend) {
      const contactEmail = process.env.CONTACT_EMAIL || 'hello@revbrain.ai';
      const ccEmails = process.env.CONTACT_CC_EMAILS?.split(',').filter(Boolean) || [];

      await resend.emails.send({
        from: 'RevBrain <do-not-reply@revbrain.ai>',
        to: contactEmail,
        cc: ccEmails,
        subject: `New contact from ${data.name} (${data.company})`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        `,
      });
    } else {
      console.warn('[Contact] Resend not configured, email not sent. Form data:', {
        name: data.name,
        email: data.email,
        company: data.company,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Contact] Failed to process form:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
