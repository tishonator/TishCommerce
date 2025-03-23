"use client";

import { useState } from "react";
import { useLocalization } from "../../context/LocalizationContext";

export default function NewsletterSignup() {
  const { newsletter } = useLocalization().homepage;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800">{newsletter.title}</h2>
        <p className="text-gray-600 mt-2">{newsletter.description}</p>

        <form onSubmit={handleSubmit} className="mt-6 flex justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={newsletter.placeholder}
            required
            className="px-4 py-3 w-72 border border-gray-300 bg-white rounded-l-md focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gray-800 text-white font-bold rounded-r-md hover:bg-gray-900 transition"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Processing..." : newsletter.buttonText}
          </button>
        </form>

        {status === "success" && <p className="mt-3 text-green-600">Thank you for subscribing!</p>}
        {status === "error" && <p className="mt-3 text-red-600">Subscription failed. Try again.</p>}
      </div>
    </section>
  );
}
