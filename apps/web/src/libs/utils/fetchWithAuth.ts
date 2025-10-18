"use server";

import { cookies } from "next/headers";
import { fetchGraphQL } from "./fetchGraphql";
import { setTokenCookies } from "./cookie";
import { universalRedirect } from "./universalRedirect";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const fetchWithAuth = async (
  query: string,
  variables?: Record<string, any>,
  options: RequestInit = {},
) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("vora_access_token")?.value;
  const refreshToken = cookieStore.get("vora_refresh_token")?.value;
  try {
    return await fetchGraphQL(query, variables, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    if (
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      try {
        const refreshRes = await fetch(
          `http://localhost:3000/api/auth/refreshToken`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
            credentials: "include",
          },
        );

        if (!refreshRes.ok) {
          cookieStore.delete("vora_access_token");
          cookieStore.delete("vora_refresh_token");

          universalRedirect("/signin");
          return;
        }
        const result = await refreshRes.json();
        await setTokenCookies("vora_access_token", result.accessToken);
        return await fetchGraphQL(query, variables, {
          ...options,
          headers: {
            ...options.headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.accessToken}`,
          },
        });
      } catch (error) {
        console.log(error);

        universalRedirect("/signin");
        throw error;
      }
    }

    throw error;
  }
};
