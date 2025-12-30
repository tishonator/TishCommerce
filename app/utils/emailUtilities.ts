import { Resend } from 'resend';
import { getLocalization } from "./getLocalization";
import { Product } from "../../types/Product";

// ----- Interfaces -----

export interface Address {
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  address2: string;
  postalCode: string;
  phone: string;
  email: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  currency: string;
}

export interface OrderCartItem extends Product {
  quantity: number;
}

export interface OrderBody {
  orderId: string,
  orderDate: string;
  cartItems: OrderCartItem[];
  shippingForm: Address;
  billingForm: Address;
  shippingMethod: ShippingMethod;
  paymentMethodId: string;
}

// ----- Send Email -----

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    console.log('📧 Attempting to send email...');
    console.log('📧 From:', process.env.RESEND_FROM_EMAIL);
    console.log('📧 To:', to);
    console.log('📧 Subject:', subject);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject,
      text,
    });

    console.log('✅ Email sent successfully:', result);
  } catch (error) {
    console.error("❌ Failed to send email to:", to, "\nError:", error);
    throw error; // Re-throw to let caller know it failed
  }
}

// ----- Format Order Summary -----

export function formatOrderSummary(cartItems: OrderCartItem[]): {
  lines: string;
  subtotal: number;
} {
  const lines = cartItems
    .map(
      (item) =>
        `- ${item.Title} × ${item.quantity} = $${(
          parseFloat(item.SalePrice || item.RegularPrice) * item.quantity
        ).toFixed(2)}`
    )
    .join("\n");

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  return { lines, subtotal };
}

// ----- Admin Email -----

export function generateAdminEmail(
  body: OrderBody,
  summary: string,
  subtotal: number,
  shipping: number,
  total: number
): string {
  return `New Order Received

Order ID: ${body.orderId}
Order Date: ${body.orderDate}
Customer: ${body.shippingForm.firstName} ${body.shippingForm.lastName}
Email: ${body.shippingForm.email}
Phone: ${body.shippingForm.phone}

Shipping Address:
${body.shippingForm.address1}
${body.shippingForm.address2}
${body.shippingForm.city}, ${body.shippingForm.state}, ${body.shippingForm.country} ${body.shippingForm.postalCode}

Shipping Method: ${body.shippingMethod.name}
Payment Method: ${body.paymentMethodId.toUpperCase()}

Order Summary:
${summary}

Subtotal: $${subtotal.toFixed(2)}
Shipping: $${shipping.toFixed(2)}
Total: $${total.toFixed(2)}

Date: ${new Date().toLocaleString()}
`;
}

// ----- Customer Email -----

export function generateCustomerEmail(
  body: OrderBody,
  summary: string,
  total: number,
  downloadURL?: string
): string {
  const { labels, siteName } = getLocalization();

  const downloadSection = downloadURL
    ? `\n\nDownload your purchased items here:\n${downloadURL}\n`
    : '';

  return `Hi ${body.shippingForm.firstName},

${labels.orderConfirmationMessage || "Your order was placed successfully. We'll notify you once it's processed."}

Order ID: ${body.orderId}
Order Date: ${body.orderDate}
Shipping Method: ${body.shippingMethod.name}
Payment Method: ${body.paymentMethodId.toUpperCase()}

Shipping Address:
${body.shippingForm.address1}
${body.shippingForm.address2}
${body.shippingForm.city}, ${body.shippingForm.state}, ${body.shippingForm.country} ${body.shippingForm.postalCode}

Order Summary:
${summary}

Total: $${total.toFixed(2)}${downloadSection}

Thank you for shopping with us!
${siteName || "TishCommerce"}
`;
}

// ----- Send Admin Email -----

export async function sendAdminEmail(body: OrderBody) {
  const { lines, subtotal } = formatOrderSummary(body.cartItems);
  const shipping = body.shippingMethod?.price || 0;
  const total = subtotal + shipping;

  const text = generateAdminEmail(body, lines, subtotal, shipping, total);
  const subject = `🛒 New Order from ${body.shippingForm.firstName} ${body.shippingForm.lastName}`;

  await sendEmail({
    to: process.env.ADMIN_EMAIL!,
    subject,
    text,
  });
}

// ----- Send Customer Email -----

export async function sendCustomerEmail(body: OrderBody, baseURL?: string) {
  const { lines, subtotal } = formatOrderSummary(body.cartItems);
  const shipping = body.shippingMethod?.price || 0;
  const total = subtotal + shipping;

  // Check if any product in cart has downloadable content
  const hasDownloads = body.cartItems.some((item) => (item as any).DownloadURL);

  // Generate download URL if there are downloadable products and we have baseURL
  const downloadURL = hasDownloads && baseURL
    ? `${baseURL}/ordersummary?orderId=${body.orderId}`
    : undefined;

  const text = generateCustomerEmail(body, lines, total, downloadURL);
  const subject =
    getLocalization().labels.orderConfirmationTitle || "Your Order Confirmation";

  await sendEmail({
    to: body.shippingForm.email,
    subject,
    text,
  });
}
