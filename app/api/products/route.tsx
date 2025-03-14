import { NextResponse } from "next/server";
import getProducts from "../../utils/getProducts";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}
