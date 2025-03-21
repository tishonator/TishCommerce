'use client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import ContactUsForm from "../components/ContactUsForm";

export default function ContactPage() {
    return (
      <main>
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
            <ContactUsForm />
        </GoogleReCaptchaProvider>
      </main>
    );
  }