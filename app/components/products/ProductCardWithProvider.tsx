"use client";

import { Provider } from "react-redux";
import { store } from "../../store/store";
import ProductCard from "./ProductCard";
import { Product } from "../../../types/Product";

export default function ProductCardWithProvider({ product }: { product: Product }) {
  return (
    <Provider store={store}>
      <ProductCard product={product} />
    </Provider>
  );
}
