import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("vora_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({
      message: "Invalid Token or Expired",
      success: false,
    });
  }

  return NextResponse.json({ success: true, accessToken });
}
