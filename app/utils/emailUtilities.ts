import nodemailer from 'nodemailer';
import { getLocalization } from "./getLocalization";
import { Product } from "../../types/Product";

// ----- Interfaces -----

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
}

// Minimal cart item interface with only required fields for emails
export interface MinimalCartItem {
  ID: string;
  Title: string;
  RegularPrice: string;
  SalePrice: string;
  quantity: number;
  DownloadURL?: string;
}

// Full cart item for PayPal orders that send complete product data
export interface OrderCartItem extends Product {
  quantity: number;
}

export interface OrderBody {
  orderId: string,
  orderDate: string;
  cartItems: MinimalCartItem[] | OrderCartItem[];
  billingForm: Address;
  paymentMethodId: string;
}

// ----- Gmail SMTP Transporter -----

function createGmailTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
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
    console.log('📧 From:', process.env.GMAIL_USER);
    console.log('📧 To:', to);
    console.log('📧 Subject:', subject);

    const transporter = createGmailTransporter();

    const result = await transporter.sendMail({
      from: `"${getLocalization().siteName || 'TishCommerce'}" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log('✅ Email sent successfully:', {
      messageId: result.messageId,
      response: result.response,
    });
  } catch (error) {
    console.error("❌ Failed to send email to:", to, "\nError:", error);
    throw error; // Re-throw to let caller know it failed
  }
}

// ----- Format Order Summary -----

export function formatOrderSummary(cartItems: MinimalCartItem[] | OrderCartItem[]): {
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
  total: number
): string {
  // Generate download links section
  const downloadableItems = body.cartItems.filter(item => item.DownloadURL);
  console.log(`📧 Admin email: Including ${downloadableItems.length} download links`);

  const downloadSection = downloadableItems.length > 0
    ? `\n\nDownload Links:\n${downloadableItems.map(item =>
        `- ${item.Title}: ${item.DownloadURL}`
      ).join('\n')}\n`
    : '';

  return `New Order Received

Order ID: ${body.orderId}
Order Date: ${body.orderDate}
Customer: ${body.billingForm.firstName} ${body.billingForm.lastName}
Email: ${body.billingForm.email}

Payment Method: ${body.paymentMethodId.toUpperCase()}

Order Summary:
${summary}

Total: $${total.toFixed(2)}${downloadSection}

Date: ${new Date().toLocaleString()}
`;
}

// ----- Customer Email -----

export function generateCustomerEmail(
  body: OrderBody,
  summary: string,
  total: number
): string {
  const { labels, siteName } = getLocalization();

  // Generate download links section for products with download URLs
  const downloadableItems = body.cartItems.filter(item => item.DownloadURL);
  console.log(`📧 Customer email: Including ${downloadableItems.length} download links`);
  if (downloadableItems.length > 0) {
    console.log(`📧 Download links:`, downloadableItems.map(item => `${item.Title}: ${item.DownloadURL}`));
  }

  const downloadSection = downloadableItems.length > 0
    ? `\n\nDownload Your Products:\n${downloadableItems.map(item =>
        `- ${item.Title}: ${item.DownloadURL}`
      ).join('\n')}\n\nPlease download your products as soon as possible. These links do not expire, but we recommend saving your products to your device.`
    : '';

  return `Hi ${body.billingForm.firstName},

${labels.orderConfirmationMessage || "Your order was placed successfully. Thank you for your purchase!"}

Order ID: ${body.orderId}
Order Date: ${body.orderDate}
Payment Method: ${body.paymentMethodId.toUpperCase()}

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
  const total = subtotal;

  const text = generateAdminEmail(body, lines, total);
  const subject = `🛒 New Order from ${body.billingForm.firstName} ${body.billingForm.lastName}`;

  await sendEmail({
    to: process.env.GMAIL_USER!,
    subject,
    text,
  });
}

// ----- Send Customer Email -----

export async function sendCustomerEmail(body: OrderBody) {
  const { lines, subtotal } = formatOrderSummary(body.cartItems);
  const total = subtotal;

  const text = generateCustomerEmail(body, lines, total);
  const subject =
    getLocalization().labels.orderConfirmationTitle || "Your Order Confirmation";

  await sendEmail({
    to: body.billingForm.email,
    subject,
    text,
  });
}
