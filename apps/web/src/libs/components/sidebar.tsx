"use client";

import React from "react";
import { SidebarMenuItem, SidebarMenuRoot } from "./sidebar-menu";

import { useParams, usePathname } from "next/navigation";
import { MenuItems } from "../utils/constants";

const Sidebar = () => {
  const basePath = usePathname();
  const params = useParams();

  return (
    <aside className="hidden md:block w-50 min-h-screen border-r border-r-slate-800 bg-[#1A1A25]">
      {Object.entries(MenuItems).map(([sectionName, items], i) => (
        <SidebarMenuRoot title={sectionName} key={sectionName + i}>
          {items.map((item, idx) => (
            <SidebarMenuItem
              key={idx}
              href={`/home/workspace/${params.id}${item.href}`}
              isActive={`/home/workspace/${params.id}${item.href}` === basePath}
            >
              <item.icon className="size-4" />
              <p>{item.title}</p>
            </SidebarMenuItem>
          ))}
        </SidebarMenuRoot>
      ))}
    </aside>
  );
};

export default Sidebar;
