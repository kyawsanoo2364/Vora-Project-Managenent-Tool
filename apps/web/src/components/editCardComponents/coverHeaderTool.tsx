"use client";

import {
  ArchiveIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  ImageIcon,
  LayoutTemplateIcon,
  UserPlus2Icon,
} from "lucide-react";
import React from "react";
import { Button } from "../modern-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../modern-ui/popover";
import MoveCardContent from "./move-card-content";
import CoverCardContent from "./cover-card-content";

const CoverHeaderTool = () => {
  return (
    <div className="absolute top-0 right-0 left-0 px-3 py-2 flex w-full justify-between items-center">
      {/**left */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <div className="px-2 py-1 rounded-md text-sm bg-gray-600 flex items-center cursor-pointer">
              Later
              <ChevronDownIcon className="size-4" />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <MoveCardContent />
          </PopoverContent>
        </Popover>
      </div>
      {/**right */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"ghost"}>
              <ImageIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <CoverCardContent />
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <UserPlus2Icon />
              Join
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ArrowRightIcon />
              Move
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LayoutTemplateIcon />
              Make Template
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ArchiveIcon />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CoverHeaderTool;
