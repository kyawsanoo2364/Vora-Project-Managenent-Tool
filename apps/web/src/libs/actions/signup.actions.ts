"use server";

import z from "zod";
import { SignUpFormSchema } from "../schemas/signup-form-schema";
import { fetchGraphQL } from "../utils/fetchGraphql";
import { print } from "graphql";
import { SIGN_UP_MUTATION } from "../utils/queryStringGraphql";

export async function SignUp(data: z.infer<typeof SignUpFormSchema>) {
  try {
    await fetchGraphQL(SIGN_UP_MUTATION, {
      ...data,
    });
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }

  return { success: true, message: "Account created successfully!" };
}
