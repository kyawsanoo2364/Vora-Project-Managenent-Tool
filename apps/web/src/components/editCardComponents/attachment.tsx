"use client";

import { LinkIcon } from "lucide-react";
import React from "react";
import AttachmentItem from "./attachmentItem";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../modern-ui/popover";
import AttachmentContent from "./attachment-content";

const Attachment = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <LinkIcon className="size-4" />
          <h3 className="text-base font-medium">Attachments</h3>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button size={"sm"} variant={"outline"}>
              Add
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <AttachmentContent />
          </PopoverContent>
        </Popover>
      </div>
      <div className=" w-full">
        <h4 className="text-sm font-medium">Files</h4>
        <div className="flex flex-col gap-2 mt-4">
          <AttachmentItem />
        </div>
      </div>
    </div>
  );
};

export default Attachment;
