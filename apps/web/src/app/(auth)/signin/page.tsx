import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SignInForm from "./_components/signInForm";

export const metadata: Metadata = {
  title: "Sign In Account in VORA.",

  description:
    "Sign In account and manage your projects with your team — all in one place.",
  keywords: [
    "project management",
    "team collaboration",
    "vora app",
    "task tracker",
  ],
  openGraph: {
    title: "Vora - Project Management Tool",
    description:
      "Collaborate, plan, and manage your projects efficiently with Vora.",
    siteName: "Vora",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "vora logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const SignInPage = () => {
  return (
    <div className="max-w-lg w-full p-8 bg-white shadow-md rounded-md">
      <div className="flex items-center justify-center w-full">
        <h1 className="text-2xl font-medium">Welcome back to </h1>
        <div className="w-32 h-16 relative ">
          <Image
            src={"/logo.png"}
            alt="Vora Logo"
            fill
            className="object-cover"
          />
        </div>
      </div>
      <h1 className="text-center text-xl font-bold">Sign In</h1>
      <h3 className="text-sm text-slate-600 text-center">
        Access your account and work together with your team.
      </h3>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
