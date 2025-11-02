"use client";

import { cn } from "@/libs/utils/helpers";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

export const SidebarMenuRoot = ({
  children,
  title,
}: PropsWithChildren<{ title: string }>) => {
  return (
    <div className="p-2 mt-2">
      <h2 className="font-semibold text-sm">{title}</h2>
      <div className="pl-2 mt-2 flex flex-col gap-3">{children}</div>
    </div>
  );
};

type SidebarMenuItemProps = PropsWithChildren<{
  className?: string;
  onClick?: () => void;
  href: string;
  basePathname?: string;
  isActive?: boolean;
}>;

export const SidebarMenuItem = ({
  children,
  className,
  href,
  onClick,

  isActive,
}: SidebarMenuItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm p-2 cursor-pointer hover:bg-gray-500/20 rounded-md  flex items-center gap-2",
        isActive && "bg-blue-500 text-white hover:bg-blue-600",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};
