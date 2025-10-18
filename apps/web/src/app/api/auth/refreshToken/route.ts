import { setTokenCookies } from "@/libs/utils/cookie";
import { fetchGraphQL } from "@/libs/utils/fetchGraphql";
import { REFRESH_TOKEN_QUERY } from "@/libs/utils/queryStringGraphql";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const cookiesStore = await cookies();
    const body = await req.json();
    const refreshToken = body.refreshToken;

    const refreshRes = await fetchGraphQL(REFRESH_TOKEN_QUERY, {
      refreshToken,
    });

    const newAccessToken = refreshRes.refreshToken.accessToken;
    // cookiesStore.delete("vora_access_token");
    // // Set cookie in the response
    // cookiesStore.set("vora_access_token", newAccessToken, {
    //   httpOnly: true,
    //   secure: false, // false for localhost, true for production
    //   sameSite: "lax",
    //   path: "/",
    //   maxAge: 60 * 60, // 1 day
    // });

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
