import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import getProducts from "../../utils/getProducts";
import { getPayPalApiBase } from "../../utils/paypalConfig";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

/**
 * GET /api/download?payment_intent_id=xxx (for Stripe)
 * GET /api/download?paypal_order_id=xxx (for PayPal)
 *
 * Verifies payment with Stripe/PayPal and returns download URLs for purchased products
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get("payment_intent_id");
    const paypalOrderId = searchParams.get("paypal_order_id");

    let productIds: string[] = [];

    // Verify Stripe payment
    if (paymentIntentId) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Check if payment succeeded
        if (paymentIntent.status !== "succeeded") {
          return NextResponse.json(
            { error: "Payment not completed" },
            { status: 400 }
          );
        }

        // Extract product IDs from metadata
        const metadata = paymentIntent.metadata;
        let index = 1;
        while (metadata[`item_${index}_id`]) {
          productIds.push(metadata[`item_${index}_id`]);
          index++;
        }
      } catch (error) {
        console.error("Stripe verification error:", error);
        return NextResponse.json(
          { error: "Failed to verify payment" },
          { status: 500 }
        );
      }
    }
    // Verify PayPal payment
    else if (paypalOrderId) {
      try {
        const auth = Buffer.from(
          `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64");

        const res = await fetch(
          `${getPayPalApiBase()}/v2/checkout/orders/${paypalOrderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${auth}`,
            },
          }
        );

        const orderData = await res.json();

        if (!res.ok) {
          console.error("PayPal verification failed:", orderData);
          return NextResponse.json(
            { error: "Failed to verify PayPal payment" },
            { status: 500 }
          );
        }

        // Check if order is completed/approved
        if (orderData.status !== "COMPLETED" && orderData.status !== "APPROVED") {
          return NextResponse.json(
            { error: "Payment not completed" },
            { status: 400 }
          );
        }

        // Extract product IDs from purchase units
        // PayPal order structure: purchase_units[0].items[]
        if (orderData.purchase_units && orderData.purchase_units[0]?.items) {
          productIds = orderData.purchase_units[0].items
            .map((item: any) => item.sku || item.name)
            .filter((id: string) => id !== "SHIPPING"); // Exclude shipping item
        }
      } catch (error) {
        console.error("PayPal verification error:", error);
        return NextResponse.json(
          { error: "Failed to verify payment" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Missing payment_intent_id or paypal_order_id" },
        { status: 400 }
      );
    }

    // Get all products with download URLs
    const allProducts = await getProducts();

    // Filter products that were purchased and have download URLs
    const downloads = productIds
      .map((id) => {
        const product = allProducts.find((p) => p.ID === id);
        if (product && (product as any).DownloadURL) {
          return {
            productId: product.ID,
            productTitle: product.Title,
            downloadURL: (product as any).DownloadURL,
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    if (downloads.length === 0) {
      return NextResponse.json(
        { message: "No downloadable products found for this order" },
        { status: 200 }
      );
    }

    return NextResponse.json({ downloads });
  } catch (error) {
    console.error("Download endpoint error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
