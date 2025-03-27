"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useLocalization } from "../context/LocalizationContext";
import Image from "next/image";
import Link from "next/link";
import { removeFromCart, updateQuantity } from "../store/slices/cartSlice";
import { showMiniCart } from "../utils/MiniCartController";
import { X, Plus, Minus } from "lucide-react";
import PayPalBasketExpressWrapper from "../components/paypal/PayPalBasketExpressWrapper";

function CartContent() {
  const { labels } = useLocalization();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const total = items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  const handleQtyChange = (id: string, delta: number) => {
    const item = items.find((i) => i.ID === id);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty >= 1) {
      dispatch(updateQuantity({ id, quantity: newQty }));
      showMiniCart();
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{labels.yourCart || "Your Cart"}</h1>

        {items.length === 0 ? (
          <p className="text-gray-600 mt-10 mb-30 text-center">{labels.cartEmpty || "Your cart is empty."}</p>
        ) : (
          <>
            <div className="space-y-6">
              {items.map((item) => {
                const price = parseFloat(item.SalePrice || item.RegularPrice);
                const itemTotal = price * item.quantity;

                return (
                  <div key={item.ID} className="flex gap-4 items-center border-b pb-4">
                    <Image
                      src={item.FeatureImageURL}
                      alt={item.Title}
                      width={80}
                      height={100}
                      className="object-cover rounded"
                    />
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.Slug}`}
                        className="text-lg font-semibold text-gray-800 hover:text-gray-600"
                      >
                        {item.Title}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {labels.price || "Price"}: ${price.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          onClick={() => handleQtyChange(item.ID, -1)}
                          className="text-gray-700 border px-2 rounded hover:bg-gray-200"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQtyChange(item.ID, 1)}
                          className="text-gray-700 border px-2 rounded hover:bg-gray-200"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-800 mt-1">
                        {labels.total || "Total"}: ${itemTotal.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        dispatch(removeFromCart(item.ID));
                        showMiniCart();
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-right space-y-4">
              <p className="text-xl font-semibold text-gray-800">
                {labels.total || "Total"}: ${total.toFixed(2)}
              </p>

              {/* PayPal Button Above Checkout Button */}
              <div className="flex justify-end">
                <div className="w-[260px]"> {/* Customize width as needed */}
                  <PayPalBasketExpressWrapper />
                </div>
              </div>

              {/* Checkout Button Below */}
              <Link
                href="/checkout"
                className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md text-sm font-semibold transition"
              >
                {labels.proceedToCheckout || "Proceed to Checkout"}
              </Link>
            </div>

          </>
        )}
      </div>
    </section>
  );
}

export default function CartPage() {
  return (
    <Provider store={store}>
      <CartContent />
    </Provider>
  );
}
