import { NextResponse } from "next/server";
import { getCheckoutSettings } from "../../utils/getCheckout"; // Use centralized utility

export async function GET() {
  try {
    const checkoutData = getCheckoutSettings(); // Fetch data from configs/checkout.json
    return NextResponse.json(checkoutData);
  } catch (error) {
    console.error("Error loading checkout file:", error);
    return NextResponse.json({ error: "Failed to load checkout file" }, { status: 500 });
  }
}
