import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic server-side validation
    if (
      !body.cartItems?.length ||
      !body.shippingForm?.email ||
      !body.billingForm?.email ||
      !body.shippingMethod?.id ||
      !body.paymentMethodId
    ) {
      return NextResponse.json({ error: "Invalid or incomplete order data." }, { status: 400 });
    }

    // Simulate sending order via email / saving to external system
    // TODO: Add logic for email notification or integration with backend
    console.log("Order Received:", body);

    return NextResponse.json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
