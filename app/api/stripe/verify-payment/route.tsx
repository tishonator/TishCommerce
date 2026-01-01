import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendAdminEmail, sendCustomerEmail, OrderBody } from "../../../utils/emailUtilities";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: NextRequest) {
  try {
    const { payment_intent_id } = await req.json();

    if (!payment_intent_id) {
      return NextResponse.json(
        { error: "Missing payment_intent_id" },
        { status: 400 }
      );
    }

    console.log(`🔍 Verifying payment intent: ${payment_intent_id}`);

    // Retrieve payment intent from Stripe to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    console.log(`Payment status: ${paymentIntent.status}`);

    // Check if payment succeeded
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        {
          success: false,
          status: paymentIntent.status,
          message: "Payment not completed",
        },
        { status: 400 }
      );
    }

    // Extract order data from metadata
    const metadata = paymentIntent.metadata;

    if (!metadata.orderId || !metadata.orderDate || !metadata.billingForm || !metadata.cartItems) {
      console.error("❌ Missing required metadata in PaymentIntent");
      return NextResponse.json(
        { error: "Missing order data in payment" },
        { status: 400 }
      );
    }

    // Parse JSON strings from metadata
    const billingForm = JSON.parse(metadata.billingForm);
    const cartItems = JSON.parse(metadata.cartItems);

    // Log cart items for debugging
    console.log(`📦 Cart items parsed from metadata:`, JSON.stringify(cartItems));
    const itemsWithDownloads = cartItems.filter((item: any) => item.DownloadURL);
    console.log(`📥 Items with download URLs: ${itemsWithDownloads.length}/${cartItems.length}`);

    // Reconstruct order body
    const orderBody: OrderBody = {
      orderId: metadata.orderId,
      orderDate: metadata.orderDate,
      billingForm,
      cartItems,
      paymentMethodId: metadata.paymentMethodId || "stripe",
    };

    console.log(`✅ Payment verified for order ${orderBody.orderId}`);

    // Check if emails already sent (to avoid duplicates with webhook)
    // We'll use a simple flag in metadata
    if (metadata.emailsSent === "true") {
      console.log("📧 Emails already sent via webhook, skipping");

      // Return download links without sending emails
      const downloadLinks = cartItems
        .filter((item: any) => item.DownloadURL)
        .map((item: any) => ({
          productId: item.ID,
          productTitle: item.Title,
          downloadURL: item.DownloadURL,
        }));

      return NextResponse.json({
        success: true,
        verified: true,
        emailsSent: false,
        downloads: downloadLinks,
      });
    }

    // Send emails if not already sent
    // Priority: Customer email first (they need download links), then admin email after delay
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
      console.error("⚠️ Some emails failed to send. Admin:", adminEmailSent, "Customer:", customerEmailSent);
    }

    // Update metadata to mark emails as sent
    try {
      await stripe.paymentIntents.update(payment_intent_id, {
        metadata: {
          ...metadata,
          emailsSent: "true",
        },
      });
    } catch (err) {
      console.error("❌ Failed to update PaymentIntent metadata:", err);
    }

    // Return download links
    const downloadLinks = cartItems
      .filter((item: any) => item.DownloadURL)
      .map((item: any) => ({
        productId: item.ID,
        productTitle: item.Title,
        downloadURL: item.DownloadURL,
      }));

    return NextResponse.json({
      success: true,
      verified: true,
      emailsSent: true,
      downloads: downloadLinks,
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
