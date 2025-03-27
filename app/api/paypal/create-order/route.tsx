import { NextResponse } from "next/server";
import { getPayPalApiBase } from "../../../utils/paypalConfig";

export async function POST(req: Request) {
  const { amount } = await req.json();

  const res = await fetch(`${getPayPalApiBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET
        ).toString("base64"),
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
    }),
  });

  const data = await res.json();
  return NextResponse.json({ orderID: data.id });
}
