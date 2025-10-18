import { redirect } from "next/navigation";
import { UserType } from "../types";
import { fetchWithAuth } from "./fetchWithAuth";
import { FETCH_SESSION_USER } from "./queryStringGraphql";

export const authUser = async () => {
  let isLoading = false;
  let user: UserType;
  try {
    isLoading = true;
    const result = await fetchWithAuth(FETCH_SESSION_USER);
    user = result.user;
  } catch (error) {
    console.log(error);
    redirect("/signin");
  } finally {
    isLoading = false;
  }

  return { user, isLoading };
};
