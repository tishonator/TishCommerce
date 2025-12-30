"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocalization } from "../../context/LocalizationContext";
import { useProductContext } from "../../context/ProductContext";
import { useAppDispatch } from "../../store/hooks";
import { clearCart } from "../../store/slices/cartSlice";
import Image from "next/image";
import { Product } from "../../../types/Product";

// Interfaces
interface CartItem extends Product {
  quantity: number;
}

interface Address {
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

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  currency: string;
}

interface OrderData {
  orderId: string;
  orderDate: string;
  cartItems: CartItem[];
  shippingForm: Address;
  billingForm: Address;
  shippingMethod: ShippingMethod;
  paymentMethodId: string;
}

// Download interface
interface Download {
  productId: string;
  productTitle: string;
  downloadURL: string;
}

export default function OrderSummaryClient() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [downloadError, setDownloadError] = useState<string>("");
  const { labels } = useLocalization();
  const { products } = useProductContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const orderIdFromQuery = searchParams.get("orderId");
    const recent = localStorage.getItem("recentOrder");

    if (recent) {
      const parsed = JSON.parse(recent) as OrderData & { paypalOrderId?: string };

      setOrder(parsed);

      // Clear cart ONCE if we're redirected from Stripe with orderId in query,
      if (orderIdFromQuery && parsed.orderId === orderIdFromQuery) {
        dispatch(clearCart());
      }

      // Handle Stripe order placement and download links
      const handleStripeOrder = async (paymentIntent: string) => {
        try {
          // Place order on server (send emails)
          const placeOrderRes = await fetch("/api/checkout/placeorder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed),
          });

          if (!placeOrderRes.ok) {
            console.error("❌ Failed to place Stripe order on server");
          }

          // Fetch downloads
          const res = await fetch(`/api/download?payment_intent_id=${paymentIntent}`);
          const data = await res.json();

          if (res.ok && data.downloads) {
            setDownloads(data.downloads);
          } else if (data.error) {
            setDownloadError(data.error);
          }
        } catch (error) {
          console.error("Error handling Stripe order:", error);
          setDownloadError("Failed to process order");
        }
      };

      // Handle PayPal downloads (order already placed)
      const handlePayPalDownloads = async (paypalOrderId: string) => {
        try {
          const res = await fetch(`/api/download?paypal_order_id=${paypalOrderId}`);
          const data = await res.json();

          if (res.ok && data.downloads) {
            setDownloads(data.downloads);
          } else if (data.error) {
            setDownloadError(data.error);
          }
        } catch (error) {
          console.error("Error fetching PayPal downloads:", error);
          setDownloadError("Failed to fetch download links");
        }
      };

      // Fetch download links if payment is confirmed
      const paymentIntent = searchParams.get("payment_intent");
      const paypalOrderId = parsed.paypalOrderId;

      if (paymentIntent) {
        handleStripeOrder(paymentIntent);
      } else if (paypalOrderId) {
        handlePayPalDownloads(paypalOrderId);
      }
    } else {
      router.push("/cart");
    }
  }, [searchParams, router, dispatch]);

  if (!order) return null;

  const total = order.cartItems.reduce((sum, item) => {
    const price = parseFloat(item.SalePrice || item.RegularPrice);
    return sum + price * item.quantity;
  }, 0);

  const shippingCost = order.shippingMethod?.price || 0;
  const grandTotal = total + shippingCost;

  const getProductImage = (id: string): string => {
    const product = products.find((p) => p.ID === id);
    return product?.FeatureImageURL || "/placeholder.png";
  };

  const renderAddress = (title: string, data: Address) => (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-700">{data.firstName} {data.lastName}</p>
      <p className="text-sm text-gray-700">{data.address1}</p>
      {data.address2 && <p className="text-sm text-gray-700">{data.address2}</p>}
      <p className="text-sm text-gray-700">{data.city}, {data.state}, {data.country} {data.postalCode}</p>
      <p className="text-sm text-gray-700">{data.phone}</p>
      <p className="text-sm text-gray-700">{data.email}</p>
    </div>
  );

  return (
    <section className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {labels.orderSummary || "Order Summary"}
      </h1>
      <p className="text-gray-600 mt-3 mb-8">
        {labels.orderConfirmationMessage ||
          "Your order was placed successfully. We’ll notify you once it’s processed."}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        {labels.orderId || "Order ID"}: {order.orderId}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        {labels.orderDate || "Order Date"}: {order.orderDate}
      </p>

      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {labels.orderDetails || "Order Details"}
        </h2>

        <ul className="space-y-4">
          {order.cartItems.map((item) => {
            const price = parseFloat(item.SalePrice || item.RegularPrice);
            const imageUrl = getProductImage(item.ID);
            return (
              <li key={item.ID} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src={imageUrl}
                    alt={item.Title}
                    width={60}
                    height={80}
                    className="rounded object-cover"
                  />
                  <span className="text-gray-800">{item.Title} × {item.quantity}</span>
                </div>
                <span className="text-gray-700">${(price * item.quantity).toFixed(2)}</span>
              </li>
            );
          })}
        </ul>

        <div className="border-t mt-6 pt-4 space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>{labels.subtotal || "Subtotal"}:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>{labels.shipping || "Shipping"}: {order.shippingMethod?.name}</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 border-t pt-2">
            <span>{labels.total || "Total"}:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600 space-y-1">
          <p>
            {labels.shippingMethod || "Shipping Method"}: {order.shippingMethod?.name}
          </p>
          <p>
            {labels.paymentMethod || "Payment Method"}:{" "}
            {order.paymentMethodId === "cod"
              ? "Cash on Delivery"
              : order.paymentMethodId === "paypal"
              ? "PayPal"
              : order.paymentMethodId === "stripe"
              ? "Credit Card (Stripe)"
              : order.paymentMethodId}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {renderAddress(labels.shippingInformation || "Shipping Info", order.shippingForm)}
          {renderAddress(labels.billingInformation || "Billing Info", order.billingForm)}
        </div>
      </div>

      {/* Download Links Section */}
      {downloads.length > 0 && (
        <div className="bg-green-50 p-6 rounded-md shadow-md mt-6 border-2 border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Download Your Products
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            Your payment has been confirmed! Click the links below to download your products:
          </p>
          <ul className="space-y-3">
            {downloads.map((download) => (
              <li key={download.productId} className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <a
                  href={download.downloadURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  {download.productTitle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Download Error Message */}
      {downloadError && (
        <div className="bg-yellow-50 p-4 rounded-md shadow-md mt-6 border-2 border-yellow-200">
          <p className="text-sm text-yellow-800">
            {downloadError}
          </p>
        </div>
      )}
    </section>
  );
}
