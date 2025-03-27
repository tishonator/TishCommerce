import { NextResponse } from "next/server";
import { getPayPalApiBase } from "../../../utils/paypalConfig";
import { getLocalization } from "../../../utils/getLocalization";
import type { CartItem } from "../../../../types/CartItem";

interface PayPalCreateBody {
  amount: string;
  currency: string;
  orderId: string;
  cartItems: CartItem[];
  shippingMethodName: string;
}

export async function POST(req: Request) {
  const { amount, currency, orderId, cartItems, shippingMethodName }: PayPalCreateBody = await req.json();

  const localization = getLocalization(); // Get localized site name
  const siteName = localization.siteName || "TishCommerce";
  const description = `${siteName} order`;

  const base = getPayPalApiBase();

  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const items = cartItems.map((item) => ({
    name: item.Title,
    unit_amount: {
      currency_code: currency,
      value: parseFloat(item.SalePrice || item.RegularPrice).toFixed(2),
    },
    quantity: item.quantity.toString(),
  }));

  const itemTotal = items.reduce(
    (acc, item) => acc + parseFloat(item.unit_amount.value) * parseInt(item.quantity),
    0
  );

  const shippingValue = (parseFloat(amount) - itemTotal).toFixed(2);

  items.push({
    name: `Shipping: ${shippingMethodName}`,
    unit_amount: {
      currency_code: currency,
      value: shippingValue,
    },
    quantity: "1",
  });

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
          invoice_id: orderId,
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

  if (!res.ok) {
    console.error("❌ Failed to create PayPal order:", data);
    return NextResponse.json({ error: data }, { status: 500 });
  }

  return NextResponse.json({ orderID: data.id });
}
