import React, { PropsWithChildren } from "react";
import Navbar from "./_components/navbar";
import AuthProvider from "@/libs/providers/auth.provider";

const DashboardLayout = async ({
  children,
  modal,
}: PropsWithChildren<{ modal: React.ReactNode }>) => {
  return (
    <AuthProvider>
      <div className="overflow-hidden h-screen w-full bg-[#1E1E2E] text-[#E0E0E0] border-b border-b-slate-800 shadow-md">
        <Navbar />
        {modal}
        {children}
      </div>
    </AuthProvider>
  );
};

export default DashboardLayout;
