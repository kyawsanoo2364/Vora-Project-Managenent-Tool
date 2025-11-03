"use client";
import React, { useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useClickAway } from "@/hooks/use-click-away";
import { Input } from "../modern-ui/input";
import {
  ClockIcon,
  LinkIcon,
  ListCheckIcon,
  LogsIcon,
  PlusIcon,
  UserPlusIcon,
} from "lucide-react";
import { Button } from "../modern-ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

import RichTextEditor from "../rich-text-editor";
import { Popover, PopoverContent, PopoverTrigger } from "../modern-ui/popover";

import ChecklistContent from "../editCardComponents/checklist-content";
import MemberContent from "../editCardComponents/member-content";
import DateContent from "../editCardComponents/date-content";
import AttachmentContent from "../editCardComponents/attachment-content";
import CheckList from "../editCardComponents/checklist";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Priority } from "@/libs/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../modern-ui/tooltip";

export const PRIORITIES: Priority[] = [
  { label: "Low", color: "#22c55e" }, // green
  { label: "Medium", color: "#eab308" }, // yellow
  { label: "High", color: "#f97316" }, // orange
  { label: "Urgent", color: "#ef4444" }, // red
];

const EditCardView = () => {
  const [isOpenTitleInput, setIsOpenTitleInput] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const titleRef = useRef(null);

  useClickAway(titleRef, () => {
    if (isOpenTitleInput) setIsOpenTitleInput(false);
  });

  const featureItems = [
    {
      label: "CheckList",
      Icon: <ListCheckIcon className="size-4" />,
      content: <ChecklistContent />,
    },
    {
      label: "Attachment",
      Icon: <LinkIcon className="size-4" />,
      content: <AttachmentContent />,
    },
    {
      label: "Member",
      Icon: <UserPlusIcon className="size-4" />,
      content: <MemberContent />,
    },
    {
      label: "Dates",
      Icon: <ClockIcon className="size-4" />,
      content: <DateContent />,
    },
  ];

  return (
    <div className=" w-full    grid md:grid-cols-2 grid-cols-1">
      <ScrollArea className="h-[90vh] w-full p-4">
        <div className="w-full flex flex-col gap-2 mt-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-row items-center gap-4" ref={titleRef}>
              <Checkbox className="cursor-pointer" />
              {isOpenTitleInput ? (
                <Input placeholder="Enter title..." className="max-w-sm" />
              ) : (
                <h1
                  onClick={() => setIsOpenTitleInput(true)}
                  className="text-xl font-medium"
                >
                  Hello Test
                </h1>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center flex-wrap gap-1">
            {featureItems.map((item, i) => (
              <Popover key={i}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    key={i}
                    className="bg-gray-500/10 hover:bg-gray-500/20"
                  >
                    {item.Icon}
                    <span>{item.label}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>{item.content}</PopoverContent>
              </Popover>
            ))}

            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  {PRIORITIES.map((p, i) => (
                    <SelectItem key={i} value={p.label}>
                      <span style={{ color: p.color }}>{p.label}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/**Description */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <LogsIcon className="text-slate-600 size-5" />

                <h3 className="font-medium text-xl text-slate-300">
                  Description
                </h3>
              </div>

              {/* <Button variant={"ghost"} className="hover:bg-gray-200/10">
              <EditIcon />
            </Button> */}
              {!showEditor && (
                <Button onClick={() => setShowEditor(true)}>
                  <PlusIcon />
                  <span>Add Description</span>
                </Button>
              )}
            </div>
            {/* {!showEditor && (
            <ScrollArea className="border border-gray-300 rounded-sm p-4 max-h-[200px]">
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi
                aliquam quidem quos quia, dignissimos dolorem libero. Lorem
                ipsum dolor sit amet, consectetur adipisicing elit. Quo
                doloremque cum enim veniam at, impedit architecto! Natus
                pariatur at eius possimus eveniet. Necessitatibus esse magnam
                quisquam ratione, sed recusandae explicabo.
              </p>
            </ScrollArea>
          )} */}
            {showEditor && (
              <>
                <RichTextEditor />
                <div className="flex flex-row items-center gap-2 mt-1">
                  <Button>Save</Button>
                  <Button
                    variant={"outline"}
                    onClick={() => setShowEditor(false)}
                    className="bg-gray-500/20 hover:bg-gray-500/30"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
          {/** Checklist */}
          <div className="flex flex-col gap-4 mt-2">
            <CheckList />
          </div>
        </div>
      </ScrollArea>
      <div className="w-full"></div>
    </div>
  );
};

export default EditCardView;
