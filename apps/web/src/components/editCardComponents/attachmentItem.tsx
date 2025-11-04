"use client";

import {
  DownloadIcon,
  EditIcon,
  EllipsisIcon,
  FileIcon,
  TrashIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverTrigger } from "../modern-ui/popover";

const AttachmentItem = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <FileIcon />
        <div className="flex flex-col ">
          <h4 className="max-w-[400px] truncate text-sm">
            File Title Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Illum aspernatur itaque officiis dolores delectus maiores quam
            accusantium voluptates, et reiciendis, eaque quos. Repudiandae
            quisquam laudantium magnam tenetur, at exercitationem voluptatum?
          </h4>
          <span className="text-[12px] text-gray-400">About 3 minutes</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon-sm"} variant={"ghost"}>
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <EditIcon /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem>
              <DownloadIcon /> Download
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              <TrashIcon className="text-red-500" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AttachmentItem;
