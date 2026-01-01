"use client";

import { useAppSelector } from "../../store/hooks";
import { useLocalization } from "../../context/LocalizationContext";
import Image from "next/image";
import Link from "next/link";

export default function OrderSummary() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { labels } = useLocalization();

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">{labels.orderSummary || "Order Summary"}</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.ID} className="flex items-center gap-4">
            <Image src={item.FeatureImageURL} alt={item.Title} width={60} height={60} className="rounded object-cover" />
            <div className="flex-1">
              <Link
                href={`/product/${item.Slug}`}
                className="text-sm font-medium text-gray-800 hover:text-gray-600"
              >
                {item.Title}
              </Link>
              <p className="text-sm text-gray-600">
                {labels.quantity || "Qty"}: {item.quantity} × ${parseFloat(item.SalePrice || item.RegularPrice).toFixed(2)}
              </p>
            </div>
            <div className="text-sm font-medium text-gray-800">
              ${(item.quantity * parseFloat(item.SalePrice || item.RegularPrice)).toFixed(2)}
            </div>
          </div>
        ))}

        <hr className="my-4" />

        <div className="flex justify-between font-bold text-base">
          <span>{labels.total || "Total"}:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
