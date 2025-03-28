import { buffer } from "micro";
import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"]!;
    const buf = await buffer(req);

    try {
      const event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("✅ Payment succeeded:", paymentIntent.id);
      }

      return res.status(200).send("ok");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("❌ Webhook error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      return res.status(400).send("Webhook Error: Unknown error");
    }
  }

  res.setHeader("Allow", "POST");
  res.status(405).end("Method Not Allowed");
}
