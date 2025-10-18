import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SignUpForm from "./_components/signup-form";

export const metadata: Metadata = {
  title: "Create new account in VORA.",

  description:
    "Create an account and manage your projects with your team — all in one place.",
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

const SignUpPage = () => {
  return (
    <div className="max-w-lg w-full p-8 bg-white shadow-md rounded-md">
      <div className="flex items-center justify-center w-full">
        <h1 className="text-2xl font-medium">Welcome to </h1>
        <div className="w-32 h-16 relative ">
          <Image
            src={"/logo.png"}
            alt="Vora Logo"
            fill
            className="object-cover"
          />
        </div>
      </div>
      <h1 className="text-center text-xl font-bold">Sign Up</h1>
      <h3 className="text-sm text-slate-600 text-center">
        Create new account and collaborate on projects with your team.
      </h3>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
