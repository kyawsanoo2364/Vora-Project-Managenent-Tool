"use client";

import { SignIn } from "@/libs/actions/signIn.actions";
import { SignInFormSchema } from "@/libs/schemas/signInForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

type FormData = z.infer<typeof SignInFormSchema>;

const SignInForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const result = await SignIn(data);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    if (searchParams.get("callback")) {
      router.replace(searchParams.get("callback")!);
    } else {
      router.replace("/home");
    }
  };

  return (
    <form
      className="flex flex-col gap-3 mt-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-base text-slate-700">
          Email
        </label>
        <input
          className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 "
          id="email"
          {...register("email", { required: true })}
          type="email"
          placeholder="john@example.com"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email?.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-base text-slate-700">
          Password
        </label>
        <input
          className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 "
          id="password"
          {...register("password", { required: true })}
          placeholder="******"
          type="password"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password?.message}
          </span>
        )}
      </div>
      <div className="mt-2 ">
        <p className="text-sm text-slate-500">
          Haven't an account yet? Please{" "}
          <Link
            href={
              searchParams.get("callback")
                ? `/signup?callback=${encodeURIComponent(searchParams.get("callback")!)}`
                : `/signup`
            }
            className="text-blue-500 hover:underline"
          >
            Register
          </Link>
          .
        </p>
      </div>
      <button
        className={`p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md  hover:opacity-95 ${isSubmitting ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <p className="flex flex-row items-center gap-4 justify-center w-full">
            <Loader2 className="w-4 animate-spin" />
            <span>Signing In...</span>
          </p>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default SignInForm;
