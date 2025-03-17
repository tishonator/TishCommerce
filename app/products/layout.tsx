import { ProductProvider } from "../context/ProductContext";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      {children}
    </ProductProvider>
  );
}
