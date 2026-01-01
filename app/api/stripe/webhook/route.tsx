import Stripe from "stripe";
import { sendAdminEmail, sendCustomerEmail, OrderBody } from "../../../utils/emailUtilities";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let rawBody: string;

  try {
    rawBody = await req.text();
  } catch {
    return new Response("Failed to read request body", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Webhook signature verification failed:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  // Handle successful payment
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log("✅ Payment succeeded:", paymentIntent.id);

    try {
      // Extract order data from metadata
      const metadata = paymentIntent.metadata;

      if (!metadata.orderId || !metadata.orderDate || !metadata.billingForm || !metadata.cartItems) {
        console.error("❌ Missing required metadata in PaymentIntent:", paymentIntent.id);
        return new Response("Missing order data in metadata", { status: 400 });
      }

      // Parse JSON strings from metadata
      const billingForm = JSON.parse(metadata.billingForm);
      const cartItems = JSON.parse(metadata.cartItems);

      // Reconstruct order body
      const orderBody: OrderBody = {
        orderId: metadata.orderId,
        orderDate: metadata.orderDate,
        billingForm,
        cartItems,
        paymentMethodId: metadata.paymentMethodId || "stripe",
      };

      // Check if emails already sent (by verify-payment endpoint)
      if (metadata.emailsSent === "true") {
        console.log("📧 Emails already sent via verify-payment endpoint, skipping");
        console.log(`✅ Order ${orderBody.orderId} already processed`);
        return new Response("ok", { status: 200 });
      }

      // Send emails with priority: customer first, then admin after delay (rate limit)
      console.log(`📧 Sending order confirmation emails for order ${orderBody.orderId}...`);
      console.log(`📧 Customer email: ${orderBody.billingForm.email}`);
      console.log(`📧 Admin email: ${process.env.GMAIL_USER}`);
      console.log(`📧 Number of cart items: ${orderBody.cartItems.length}`);

      let adminEmailSent = false;
      let customerEmailSent = false;

      // 1. Send customer email first (priority - they need download links)
      try {
        await sendCustomerEmail(orderBody);
        console.log("✅ Customer email sent successfully");
        customerEmailSent = true;
      } catch (err) {
        console.error("❌ Failed to send customer email:", err);
        if (err instanceof Error) {
          console.error("❌ Customer email error details:", err.message);
        }
      }

      // 2. Wait 2 seconds to respect Resend rate limit (2 requests per second)
      console.log("⏳ Waiting 2 seconds before sending admin email (rate limit)...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Send admin email
      try {
        await sendAdminEmail(orderBody);
        console.log("✅ Admin email sent successfully");
        adminEmailSent = true;
      } catch (err) {
        console.error("❌ Failed to send admin email:", err);
        if (err instanceof Error) {
          console.error("❌ Admin email error details:", err.message);
        }
      }

      if (!adminEmailSent || !customerEmailSent) {
        console.error("⚠️ Webhook: Some emails failed. Admin:", adminEmailSent, "Customer:", customerEmailSent);
      }

      // Update metadata to mark emails as sent
      try {
        await stripe.paymentIntents.update(paymentIntent.id, {
          metadata: {
            ...metadata,
            emailsSent: "true",
          },
        });
        console.log("✅ Marked emails as sent in PaymentIntent metadata");
      } catch (err) {
        console.error("❌ Failed to update PaymentIntent metadata:", err);
      }

      console.log(`✅ Order ${orderBody.orderId} processed successfully via webhook`);
    } catch (err) {
      console.error("❌ Error processing webhook order:", err);
      // Still return 200 so Stripe doesn't retry
      return new Response("Error processing order", { status: 200 });
    }
  }

  // Handle failed payment
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.error("❌ Payment failed:", paymentIntent.id);
  }

  return new Response("ok", { status: 200 });
}
