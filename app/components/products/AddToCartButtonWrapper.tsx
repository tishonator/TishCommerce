"use client";

import { Provider } from "react-redux";
import { store } from "../../store/store";
import AddToCartButton from "./AddToCartButton";
import { Product } from "../../../types/Product";

interface WrapperProps {
  product: Product;
}

export default function AddToCartButtonWrapper({ product }: WrapperProps) {
  return (
    <Provider store={store}>
      <AddToCartButton product={product} />
    </Provider>
  );
}
