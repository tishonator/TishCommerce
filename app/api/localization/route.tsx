import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const localePath = path.join(process.cwd(), "locales/en.json");
    const data = fs.readFileSync(localePath, "utf-8");
    const jsonData = JSON.parse(data);
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error("Error loading localization file:", error);
    return NextResponse.json({ error: "Failed to load localization file" }, { status: 500 });
  }
}
