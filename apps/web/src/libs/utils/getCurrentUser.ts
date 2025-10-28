import { cookies } from "next/headers";
import { fetchWithAuth } from "./fetchWithAuth";
import { FETCH_SESSION_USER } from "./queryStringGraphql";

export async function getCurrentUser() {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("vora_access_token")?.value;

  if (!accessToken) return null;

  try {
    const result = await fetchWithAuth(FETCH_SESSION_USER, {}, {}, () => {});
    return result.user;
  } catch (error) {
    return null;
  }
}
