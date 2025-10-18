"use server";
import { cookies } from "next/headers";

export const setTokenCookies = async (name: string, payload: string) => {
  (await cookies()).set(`${name}`, payload, {
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    path: "/",
  });
};

export const clearTokenCookies = async (name: string) => {
  (await cookies()).delete(name);
};
