import { cookies } from "next/headers";

export async function POST() {
  const cookiesStore = await cookies();
  cookiesStore.delete("vora_access_token");
  cookiesStore.delete("vora_refresh_token");
  return Response.json({ message: "Successfully logout" });
}
