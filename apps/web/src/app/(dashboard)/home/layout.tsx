import Sidebar from "@/libs/components/sidebar";
import React, { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-row gap-2">
      <Sidebar />
      {children}
    </div>
  );
};

export default layout;
