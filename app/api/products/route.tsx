import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import getProducts from "../../utils/getProducts";

/**
 * GET /api/products
 * Optionally pass ?slug=someSlug to fetch a single product.
 */
export async function GET(request: NextRequest) {
  try {
    // Parse the query param "slug"
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    // Load all products from existing function
    const products = await getProducts();

    // Filter out DownloadURL from all products for security
    const filterDownloadURL = (product: any) => {
      const { DownloadURL, ...productWithoutDownload } = product;
      return productWithoutDownload;
    };

    // If "slug" is present, return just that product. Otherwise, return all products
    if (slug) {
      const product = products.find((p) => p.Slug === slug);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(filterDownloadURL(product));
    } else {
      // Return all products if no slug provided (without download URLs)
      return NextResponse.json(products.map(filterDownloadURL));
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
