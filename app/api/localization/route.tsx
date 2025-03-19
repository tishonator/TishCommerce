import { NextResponse } from "next/server";
import { getLocalization } from "../../utils/getLocalization"; // Import centralized function

export async function GET() {
  try {
    const jsonData = getLocalization(); // Use getLocalization.ts
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error("Error loading localization file:", error);
    return NextResponse.json({ error: "Failed to load localization file" }, { status: 500 });
  }
}
