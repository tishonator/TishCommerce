import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { name, email, message, token } = await req.json();

  const verifyRes = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    {
      method: 'POST',
    }
  );

  const captchaValidation = await verifyRes.json();

  if (!captchaValidation.success || captchaValidation.score < 0.5) {
    return NextResponse.json({ success: false, message: 'CAPTCHA verification failed.' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    authMethod: process.env.EMAIL_AUTHMETHOD,
    tls: {
      minVersion: 'TLSv1.2', // Ensuring compatibility with modern TLS
      rejectUnauthorized: false, // Disable certificate verification (only if needed)
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.RECEIVING_EMAIL,
      subject: `Contact Form Submission from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
