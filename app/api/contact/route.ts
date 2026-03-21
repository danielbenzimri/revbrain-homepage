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

    // Send emails via Resend
    if (resend) {
      const contactEmail = process.env.CONTACT_EMAIL || 'hello@revbrain.ai';
      const ccEmails = process.env.CONTACT_CC_EMAILS?.split(',').filter(Boolean) || [];

      // 1. Internal notification
      await resend.emails.send({
        from: 'RevBrain <do-not-reply@revbrain.ai>',
        to: contactEmail,
        cc: ccEmails,
        replyTo: data.email,
        subject: `New contact from ${data.name} (${data.company})`,
        html: `
          <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f172a;">New Contact Form Submission</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #64748b;">Name</td><td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${data.name}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #7c3aed;">${data.email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Company</td><td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${data.company}</td></tr>
              ${data.phone ? `<tr><td style="padding: 8px 0; color: #64748b;">Phone</td><td style="padding: 8px 0; color: #0f172a;">${data.phone}</td></tr>` : ''}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #7c3aed;">
              <p style="margin: 0; color: #334155; white-space: pre-wrap;">${data.message}</p>
            </div>
          </div>
        `,
      });

      // 2. Acknowledgment to the user
      const isHebrew = data.name && /[\u0590-\u05FF]/.test(data.name);
      await resend.emails.send({
        from: 'RevBrain <do-not-reply@revbrain.ai>',
        to: data.email,
        replyTo: contactEmail,
        subject: isHebrew
          ? 'קיבלנו את הפנייה שלך — RevBrain'
          : 'We received your message — RevBrain',
        html: isHebrew
          ? `
          <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
            <div style="text-align: center; padding: 24px 0;">
              <div style="display: inline-block; width: 40px; height: 40px; background: linear-gradient(135deg, #7c3aed, #14b8a6); border-radius: 8px; color: white; font-size: 20px; font-weight: bold; line-height: 40px; text-align: center;">R</div>
            </div>
            <h2 style="color: #0f172a; margin-bottom: 8px;">היי ${data.name},</h2>
            <p style="color: #475569; line-height: 1.6;">תודה שפנית אלינו! קיבלנו את ההודעה שלך ונחזור אליך בהקדם.</p>
            <p style="color: #475569; line-height: 1.6;">בינתיים, אם יש לך שאלות נוספות, אל תהסס/י לענות על מייל זה.</p>
            <p style="color: #475569; margin-top: 24px;">צוות RevBrain</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">RevBrain — AI-powered Salesforce CPQ to Revenue Cloud migration</p>
          </div>
          `
          : `
          <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 24px 0;">
              <div style="display: inline-block; width: 40px; height: 40px; background: linear-gradient(135deg, #7c3aed, #14b8a6); border-radius: 8px; color: white; font-size: 20px; font-weight: bold; line-height: 40px; text-align: center;">R</div>
            </div>
            <h2 style="color: #0f172a; margin-bottom: 8px;">Hi ${data.name},</h2>
            <p style="color: #475569; line-height: 1.6;">Thank you for reaching out! We've received your message and will get back to you shortly.</p>
            <p style="color: #475569; line-height: 1.6;">In the meantime, if you have any additional questions, feel free to reply to this email.</p>
            <p style="color: #475569; margin-top: 24px;">The RevBrain Team</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">RevBrain — AI-powered Salesforce CPQ to Revenue Cloud migration</p>
          </div>
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
