import { NextResponse } from "next/server";
import { getPayPalApiBase } from "../../../utils/paypalConfig";
import { getLocalization } from "../../../utils/getLocalization";
import type { CartItem } from "../../../../types/CartItem";

interface PayPalBasketBody {
  amount: string;
  currency: string;
  orderId: string;
  cartItems: CartItem[];
}

export async function POST(req: Request) {
  try {
    const {
      amount,
      currency,
      orderId,
      cartItems,
    }: PayPalBasketBody = await req.json();

    if (!amount || !currency || !orderId || !cartItems?.length) {
      return NextResponse.json({ error: "Invalid PayPal request data" }, { status: 400 });
    }

    const localization = getLocalization();
    const siteName = localization.siteName || "TishCommerce";
    const description = `${siteName} order`;

    const auth = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const base = getPayPalApiBase();

    // Build product line items
    const items = cartItems.map((item) => ({
      name: item.Title,
      sku: item.ID, // Store product ID for download verification
      unit_amount: {
        currency_code: currency,
        value: parseFloat(item.SalePrice || item.RegularPrice).toFixed(2),
      },
      quantity: item.quantity.toString(),
    }));

    const invoiceId = `${orderId}-${Date.now()}`;

    const res = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            invoice_id: invoiceId,
            description,
            amount: {
              currency_code: currency,
              value: amount,
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: amount,
                },
              },
            },
            items,
          },
        ],
      }),
    });

    const data = await res.json();

    console.log("📦 PayPal order response:", data);

    if (!res.ok) {
      console.error("❌ PayPal Basket Express order failed:", data);
      return NextResponse.json({ error: data }, { status: 500 });
    }

    return NextResponse.json({ orderID: data.id });
  } catch (err) {
    console.error("❌ Basket Express endpoint error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
