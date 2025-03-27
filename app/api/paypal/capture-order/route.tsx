import { NextResponse } from "next/server";
import { getPayPalApiBase } from "../../../utils/paypalConfig";

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json();

    const auth = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const res = await fetch(`${getPayPalApiBase()}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ PayPal capture failed:", data);
      return NextResponse.json({ success: false, error: data }, { status: 500 });
    }

    return NextResponse.json({ success: true, details: data });
  } catch (error) {
    console.error("❌ Capture order error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
