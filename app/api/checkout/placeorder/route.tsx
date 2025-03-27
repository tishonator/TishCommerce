import { NextRequest, NextResponse } from "next/server";
import { sendAdminEmail, sendCustomerEmail, OrderBody } from "../../../utils/emailUtilities";
import getProducts from "../../../utils/getProducts";
import { getCheckoutSettings } from "../../../utils/getCheckout";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderBody;

    // 1. Basic validation
    if (
      !body.cartItems?.length ||
      !body.shippingForm?.email ||
      !body.billingForm?.email ||
      !body.shippingMethod?.id ||
      !body.paymentMethodId
    ) {
      return NextResponse.json({ error: "Invalid or incomplete order data." }, { status: 400 });
    }

    // 2. Load settings and validate payment method
    const settings = getCheckoutSettings();
    const paymentMethodValid = settings.paymentMethods.some(
      (pm) => pm.id === body.paymentMethodId && pm.enabled
    );

    if (!paymentMethodValid) {
      return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
    }

    // 3. Validate shipping method exists and matches price
    const expectedShipping = settings.shippingMethods.find(
      (s) => s.id === body.shippingMethod?.id
    );

    if (
      !expectedShipping ||
      expectedShipping.price !== body.shippingMethod.price ||
      expectedShipping.name !== body.shippingMethod.name
    ) {
      return NextResponse.json({ error: "Invalid shipping method or price mismatch." }, { status: 400 });
    }

    // 4. Validate product prices and IDs
    const allProducts = await getProducts();
    const validProducts = body.cartItems.every((item) => {
      const found = allProducts.find((p) => p.ID === item.ID);
      if (!found) return false;
      const expectedPrice = parseFloat(found.SalePrice || found.RegularPrice);
      const submittedPrice = parseFloat(item.SalePrice || item.RegularPrice);
      return expectedPrice === submittedPrice;
    });

    if (!validProducts) {
      return NextResponse.json({ error: "One or more product prices are invalid." }, { status: 400 });
    }

    // Send emails in background
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

    return NextResponse.json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("❌ Order placement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
