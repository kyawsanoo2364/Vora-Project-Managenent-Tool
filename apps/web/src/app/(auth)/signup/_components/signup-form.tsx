"use client";

import { SignUpFormSchema } from "@/libs/schemas/signup-form-schema";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUp } from "@/libs/actions/signup.actions";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";
import { redirect } from "next/navigation";

type FormData = z.infer<typeof SignUpFormSchema>;

const SignUpForm = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const result = await SignUp(data);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    redirect("/signin");
  };

  return (
    <form
      className="flex flex-col gap-3 mt-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-base text-slate-700">
          Username
        </label>
        <input
          className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 "
          id="username"
          placeholder="johndoe12"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <span className="text-red-500 text-sm">
            {errors.username?.message}
          </span>
        )}
      </div>
      <div className="flex items-center flex-col md:flex-row w-full md:justify-between gap-2">
        <div className="flex flex-col flex-1 gap-2 w-full">
          <label htmlFor="firstName" className="text-base text-slate-700">
            First Name
          </label>
          <input
            className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
            id="firstName"
            {...register("firstName", { required: true })}
            placeholder="John"
          />
          {errors.firstName && (
            <span className="text-red-500 text-sm">
              {errors.firstName?.message}
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 gap-2 w-full">
          <label htmlFor="lastName" className="text-base text-slate-700">
            Last Name
          </label>
          <input
            className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
            id="lastName"
            {...register("lastName", { required: true })}
            placeholder="Doe"
          />
          {errors.lastName && (
            <span className="text-red-500 text-sm">
              {errors.lastName?.message}
            </span>
          )}
        </div>
      </div>
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
          Already have an account? Please{" "}
          <Link href={"/signin"} className="text-blue-500 hover:underline">
            Sign In
          </Link>
          .
        </p>
      </div>
      <button
        disabled={isSubmitting}
        className={`p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md  hover:opacity-95 ${isSubmitting ? "opacity-90 cursor-not-allowed" : "cursor-pointer"}`}
        type="submit"
      >
        {isSubmitting ? (
          <p className="flex gap-4 items-center justify-center">
            <Loader2Icon className="w-4 animate-spin" />
            <span>Creating account...</span>
          </p>
        ) : (
          "Create An Account"
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
