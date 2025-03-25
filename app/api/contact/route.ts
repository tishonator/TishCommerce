import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  const { name, email, message, token } = await req.json();

  // Step 1: reCAPTCHA Validation
  const verifyRes = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    {
      method: 'POST',
    }
  );

  const captchaValidation = await verifyRes.json();

  if (!captchaValidation.success || captchaValidation.score < 0.5) {
    return NextResponse.json(
      { success: false, message: 'CAPTCHA verification failed.' },
      { status: 400 }
    );
  }

  // Step 2: Setup Resend
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: `Contact Form Submission from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Failed to send email via Resend:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
