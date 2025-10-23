import { authUser } from "@/libs/utils/authUser";

import React, { PropsWithChildren } from "react";
import Navbar from "./_components/navbar";
import AuthProvider from "@/libs/providers/auth.provider";
import Sidebar from "@/libs/components/sidebar";

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <div className="overflow-hidden h-screen w-full bg-[#1E1E2E] text-[#E0E0E0] border-b border-b-slate-800 shadow-md">
        <Navbar />
        {children}
      </div>
    </AuthProvider>
  );
};

export default DashboardLayout;
