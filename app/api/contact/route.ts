import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  const { name, email, message, token } = await req.json();

  // Step 1: reCAPTCHA Validation
  console.log('🔍 Validating reCAPTCHA token...');
  const verifyRes = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    {
      method: 'POST',
    }
  );

  const captchaValidation = await verifyRes.json();
  console.log('📋 reCAPTCHA validation result:', JSON.stringify(captchaValidation, null, 2));

  if (!captchaValidation.success || captchaValidation.score < 0.5) {
    console.error('❌ reCAPTCHA validation failed:', {
      success: captchaValidation.success,
      score: captchaValidation.score,
      'error-codes': captchaValidation['error-codes'],
    });
    return NextResponse.json(
      { success: false, message: 'CAPTCHA verification failed.' },
      { status: 400 }
    );
  }

  console.log('✅ reCAPTCHA validation passed with score:', captchaValidation.score);

  // Step 2: Setup Resend
  console.log('📧 Attempting to send email via Resend...');
  console.log('📧 From:', process.env.RESEND_FROM_EMAIL);
  console.log('📧 To:', process.env.ADMIN_EMAIL);

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: `Contact Form Submission from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    console.log('✅ Email sent successfully via Resend:', result);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Failed to send email via Resend:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
