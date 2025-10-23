"use client";

import { Button } from "@/components/modern-ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/modern-ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initialAvatarText } from "@/libs/utils/helpers";
import { XIcon } from "lucide-react";
import React from "react";

const WorkspaceMemberItem = () => {
  return (
    <div className="w-full p-2 flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2 items-center">
        <Avatar>
          <AvatarImage src={``} alt="" />
          <AvatarFallback>{initialAvatarText("Kyaw San Oo")}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col ">
          <h2 className="text-base font-medium">Kyaw San Oo</h2>
          <span className="text-sm text-gray-400">@kyawsanoo</span>
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <Select defaultValue="ADMIN">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>Admin</TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Can view, create and edit Workspace boards, and change
                      settings for the Workspace.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SelectItem>
            <SelectItem value="MEMBER">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>Member</TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Can view, create and edit Workspace boards but not change
                      settings.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SelectItem>
          </SelectContent>
        </Select>
        <Button variant={"destructive"}>
          <XIcon /> Remove{" "}
        </Button>
      </div>
    </div>
  );
};

export default WorkspaceMemberItem;
