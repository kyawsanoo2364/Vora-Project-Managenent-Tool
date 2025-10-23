"use client";

import React from "react";
import { SidebarMenuItem, SidebarMenuRoot } from "./sidebar-menu";

import { useParams, usePathname } from "next/navigation";
import { MenuItems } from "../utils/constants";
import { ScrollArea } from "@radix-ui/themes";

const Sidebar = () => {
  const basePath = usePathname();
  const params = useParams();

  return (
    <aside className="hidden md:flex w-50  border-r border-r-slate-800 bg-[#1A1A25]  flex-col">
      <ScrollArea scrollbars="vertical" style={{ height: "100vh" }}>
        {Object.entries(MenuItems).map(([sectionName, items], i) => (
          <SidebarMenuRoot title={sectionName} key={sectionName + i}>
            {items.map((item, idx) => (
              <SidebarMenuItem
                key={idx}
                href={`/home/workspace/${params.id}${item.href}`}
                isActive={
                  `/home/workspace/${params.id}${item.href}` === basePath
                }
              >
                <item.icon className="size-4" />
                <p>{item.title}</p>
              </SidebarMenuItem>
            ))}
          </SidebarMenuRoot>
        ))}
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
