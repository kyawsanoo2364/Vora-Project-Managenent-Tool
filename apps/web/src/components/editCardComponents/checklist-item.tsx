"use client";

import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ClockIcon, Trash2Icon, UserPlus2Icon } from "lucide-react";
import { Input } from "../ui/input";
import { ChecklistItem as ChecklistItemType } from "@/libs/types";

interface Props {
  data: ChecklistItemType;
}

const ChecklistItem = ({ data }: Props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [content, setContent] = useState(data.content);
  const [checked, setChecked] = useState(data.isCompleted);

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-row items-center gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={(checked) => setChecked(!!checked)}
        />
        {isEdit ? (
          <div className="p-4 flex flex-col gap-4 w-full border rounded-md ">
            <Input
              placeholder="Edit item name..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex items-center  justify-between">
              <div className="flex items-center gap-2 ">
                <Button size={"sm"}>Save</Button>
                <Button
                  size={"sm"}
                  onClick={() => setIsEdit(false)}
                  variant={"outline"}
                >
                  Cancel
                </Button>
              </div>
              {/* <div className="flex items-center gap-2">
                <Button variant={"ghost"} size={"icon-sm"}>
                  <ClockIcon />
                </Button>
                <Button variant={"ghost"} size={"icon-sm"}>
                  <UserPlus2Icon />
                </Button>
                <Button variant={"ghost"} size={"icon-sm"}>
                  <Trash2Icon />
                </Button>
              </div> */}
            </div>
          </div>
        ) : (
          <div className=" p-2 flex flex-row items-center hover:bg-gray-500/10 w-full justify-between rounded-md cursor-pointer">
            <h3
              className="text-base font-medium w-full"
              onClick={() => setIsEdit(true)}
            >
              {data.content}
            </h3>
            <div className="flex flex-row items-center gap-2">
              <Button variant={"ghost"} size={"sm"}>
                <ClockIcon />
              </Button>
              <Button variant={"ghost"} size={"sm"}>
                <UserPlus2Icon />
              </Button>
              <Button variant={"destructive"} size={"sm"}>
                <Trash2Icon />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistItem;
