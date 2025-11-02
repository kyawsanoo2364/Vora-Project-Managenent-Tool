"use client";

import React from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "../ui/command";

const MemberContent = () => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-medium text-center">Members</h3>
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium ">Board Members</h4>
        <Command className="w-full">
          <CommandInput placeholder="search member..." />

          <CommandList className="max-h-[100px]">
            <CommandEmpty>
              <span className="text-slate-500 font-medium">
                No Result Found.
              </span>
            </CommandEmpty>
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default MemberContent;
