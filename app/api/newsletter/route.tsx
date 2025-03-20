import { NextResponse } from "next/server";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `apikey ${MAILCHIMP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Subscription failed" }, { status: 400 });
    }

    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Mailchimp API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
