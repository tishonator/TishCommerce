import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getLocalization } from "../../../utils/getLocalization";
import type { CartItem } from "../../../../types/CartItem";
import type { Product } from "../../../../types/Product";
import productsData from "../../../../configs/products.json";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

// Helper to get products (now using direct import for compatibility with Vercel, Cloudflare, and Netlify)
function getProductsSync(): Product[] {
  try {
    return productsData as Product[];
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

interface BillingForm {
  firstName: string;
  lastName: string;
  email: string;
}

interface StripeIntentBody {
  amount: number;
  currency: string;
  orderId: string;
  orderDate: string;
  cartItems?: CartItem[];
  billingForm: BillingForm;
  paymentMethodId: string;
}

export async function POST(req: Request) {
  try {
    const {
      amount,
      currency,
      orderId,
      orderDate,
      cartItems = [],
      billingForm,
      paymentMethodId,
    }: StripeIntentBody = await req.json();

    const localization = getLocalization();
    const siteName = localization.siteName || "TishCommerce";

    // Get products to fetch download URLs
    const products = getProductsSync();

    // Create minimal cart items for metadata (Stripe has 500 char limit per field)
    // Only store essential fields needed for order processing and emails
    const minimalCartItems = cartItems.map(item => {
      const product = products.find(p => p.ID === item.ID);
      return {
        ID: item.ID,
        Title: item.Title,
        RegularPrice: item.RegularPrice,
        SalePrice: item.SalePrice,
        quantity: item.quantity,
        ...(product?.DownloadURL && { DownloadURL: product.DownloadURL }),
      };
    });

    // Store essential order data in metadata for webhook processing
    const metadata: Record<string, string> = {
      orderId,
      orderDate,
      siteName,
      paymentMethodId,
      // Store billing form as JSON string (within 500 char limit)
      billingForm: JSON.stringify(billingForm),
      // Store minimal cart items as JSON string (within 500 char limit)
      cartItems: JSON.stringify(minimalCartItems),
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description: `${siteName} Order ${orderId}`,
      metadata,
      automatic_payment_methods: { enabled: true },
      receipt_email: billingForm.email, // Send Stripe receipt to customer
    });

    console.log(`✅ Created PaymentIntent ${paymentIntent.id} for order ${orderId}`);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Stripe create-payment-intent error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
