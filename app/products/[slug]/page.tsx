import { notFound } from "next/navigation";
import getProducts from "../../utils/getProducts";
import Image from "next/image";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const products = await getProducts();
  const product = products.find((p) => p.Slug === params.slug);

  if (!product) {
    return notFound();
  }

  return (
    <section className="py-12 bg-stone-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h1 className="text-3xl font-bold">{product.Title}</h1>
          <p className="text-gray-700 mt-2">{product.LongDescription}</p>
          <div className="relative w-full h-96 mt-6">
            <Image src={product.FeatureImageURL} alt={product.Title} fill className="rounded-lg object-cover" />
          </div>
          <p className="text-xl font-semibold mt-4 text-red-600">${product.SalePrice}</p>
        </div>
      </div>
    </section>
  );
}
