"use client";

import { Input } from "@/components/modern-ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React from "react";
import WorkspaceMemberItem from "./_components/workspace-member-item";

const MembersPage = () => {
  return (
    <div className="w-full h-full flex flex-col p-4">
      <h2 className="text-xl font-semibold">Workspace Members (4)</h2>
      <p className="text-sm text-slate-300 mt-2">
        Workspace member can view and join all Workspace boards and create new
        boards in the Workspace.
      </p>
      <Separator className="my-2" />
      <div className="w-full">
        <h4 className="text-lg font-semibold">Invite Member</h4>
        <div className="grid grid-cols-6">
          <div className="col-span-4">
            <p className="mt-2 text-sm text-slate-300 text-pretty ">
              Invite members to your workspace and build a shared place for
              ideas, tasks, and progress. Whether you're working with a small
              team or a growing organization, collaboration starts with a simple
              invite.
            </p>
          </div>
          <div className="col-span-2 flex flex-row items-center gap-4 justify-end">
            <button className="text-sm underline cursor-pointer hover:text-blue-500">
              Disable Link
            </button>
            <button className="p-2 text-sm cursor-pointer hover:bg-gray-100/5  border rounded-md flex flex-row items-center gap-2">
              <Plus className="size-4" /> Invite With Link
            </button>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col w-full gap-4">
        <Input placeholder="Filter by name" className="w-72" />
        <ScrollArea className="w-full h-80 ">
          {Array.from({ length: 6 }).map((_, i) => (
            <WorkspaceMemberItem key={i} />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MembersPage;
