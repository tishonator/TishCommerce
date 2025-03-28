import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getLocalization } from "../../../utils/getLocalization";
import type { CartItem } from "../../../../types/CartItem";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

interface StripeIntentBody {
  amount: number;
  currency: string;
  orderId: string;
  cartItems?: CartItem[]; // Mark as optional
  shippingMethodName: string;
}

export async function POST(req: Request) {
  try {
    const {
      amount,
      currency,
      orderId,
      cartItems = [], // fallback to empty array
      shippingMethodName,
    }: StripeIntentBody = await req.json();

    const localization = getLocalization();
    const siteName = localization.siteName || "TishCommerce";

    const metadata: Record<string, string> = {
      orderId,
      siteName,
      shippingMethod: shippingMethodName,
    };

    if (Array.isArray(cartItems)) {
      cartItems.forEach((item, index) => {
        metadata[`item_${index + 1}_title`] = item.Title;
        metadata[`item_${index + 1}_qty`] = item.quantity.toString();
        metadata[`item_${index + 1}_price`] = (item.SalePrice || item.RegularPrice).toString();
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description: `${siteName} Order ${orderId}`,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Stripe create-payment-intent error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
