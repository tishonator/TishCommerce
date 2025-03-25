import { NextRequest, NextResponse } from "next/server";
import { sendAdminEmail, sendCustomerEmail } from "../../../utils/emailUtilities";
import { OrderBody } from "../../../utils/emailUtilities";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderBody;

    // Basic validation
    if (
      !body.cartItems?.length ||
      !body.shippingForm?.email ||
      !body.billingForm?.email ||
      !body.shippingMethod?.id ||
      !body.paymentMethodId
    ) {
      return NextResponse.json({ error: "Invalid or incomplete order data." }, { status: 400 });
    }

    // 📨 Send emails in the background (without delaying response)
    void (async () => {
      try {
        await sendAdminEmail(body);
      } catch (err) {
        console.error("❌ Failed to send admin email:", err);
      }

      try {
        await sendCustomerEmail(body);
      } catch (err) {
        console.error("❌ Failed to send customer email:", err);
      }
    })();

    // ✅ Immediate response to client
    return NextResponse.json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("❌ Order placement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
