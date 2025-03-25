"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setOrderInfo } from "../../store/slices/checkoutSlice";
import { v4 as uuidv4 } from "uuid";

export default function OrderInfoInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const newId = uuidv4().split("-")[0]; // Short unique ID
    const date = new Date().toISOString().split("T")[0];

    dispatch(setOrderInfo({id:newId, date:date}));
  }, [dispatch]);

  return null; // No UI
}
