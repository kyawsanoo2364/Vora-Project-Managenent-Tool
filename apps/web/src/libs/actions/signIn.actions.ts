"use server";

import z from "zod";
import { SignInFormSchema } from "../schemas/signInForm.schema";
import { fetchGraphQL } from "../utils/fetchGraphql";
import { SIGN_IN_MUTATION } from "../utils/queryStringGraphql";

import { setTokenCookies } from "../utils/cookie";

export const SignIn = async (data: z.infer<typeof SignInFormSchema>) => {
  try {
    const result = await fetchGraphQL(SIGN_IN_MUTATION, {
      ...data,
    });

    const { accessToken, refreshToken } = result.signIn;

    await setTokenCookies("vora_access_token", accessToken);
    await setTokenCookies("vora_refresh_token", refreshToken);

    return { success: true, message: "Sign In successfully!" };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
};
