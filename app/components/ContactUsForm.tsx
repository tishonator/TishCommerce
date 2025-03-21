'use client';

import { useState, FormEvent } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useLocalization } from '@/app/context/LocalizationContext';

export default function ContactUsForm() {
  const { contactForm } = useLocalization();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      setStatus(contactForm.captchaError);
      return;
    }

    const token = await executeRecaptcha('contact_us');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, token }),
      });

      if (!res.ok) throw new Error('Something went wrong');

      setName('');
      setEmail('');
      setMessage('');
      setStatus(contactForm.successMessage);
      setTimeout(() => setStatus(null), 5000);
    } catch {
      setStatus(contactForm.errorMessage);
    }
  };

  return (
    <section className="w-full min-h-screen bg-stone-100 py-16">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-black text-center">{contactForm.title}</h2>

        {status && <div className="mb-4 text-green-600 font-semibold">{status}</div>}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 space-y-6 mt-3"
        >
          {/* Name Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {contactForm.nameLabel}
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder={contactForm.namePlaceholder}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {contactForm.emailLabel}
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder={contactForm.emailPlaceholder}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {contactForm.messageLabel}
            </label>
            <textarea
              rows={6}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder={contactForm.messagePlaceholder}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-semibold transition"
          >
            {contactForm.buttonText}
          </button>
        </form>
      </div>
    </section>
  );
}
