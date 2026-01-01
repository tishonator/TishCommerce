"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setOrderInfo } from "../../store/slices/checkoutSlice";
import { v4 as uuidv4 } from "uuid";

export default function OrderInfoInitializer() {
  const dispatch = useAppDispatch();
  const orderId = useAppSelector((state) => state.checkout.orderId);

  useEffect(() => {
    // Only generate if orderId doesn't exist
    if (!orderId) {
      const newId = uuidv4().split("-")[0]; // Short unique ID
      const date = new Date().toISOString().split("T")[0];

      dispatch(setOrderInfo({ id: newId, date: date }));
    }
  }, [orderId, dispatch]);

  return null; // No UI
}
