import React, { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 text-black">
      {children}
    </div>
  );
};

export default AuthLayout;
