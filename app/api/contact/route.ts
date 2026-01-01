import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

  // Step 2: Send email via Gmail SMTP
  console.log('📧 Attempting to send email via Gmail SMTP...');
  console.log('📧 From:', process.env.GMAIL_USER);
  console.log('📧 To:', process.env.GMAIL_USER);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    const result = await transporter.sendMail({
      from: `"TishCommerce Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER!,
      subject: `Contact Form Submission from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    console.log('✅ Email sent successfully via Gmail:', {
      messageId: result.messageId,
      response: result.response,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Failed to send email via Gmail:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
