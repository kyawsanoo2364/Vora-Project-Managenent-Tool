"use client";

import React, { useRef, useState } from "react";

import { Input } from "../ui/input";
import { useClickAway } from "@/hooks/use-click-away";
import {
  CheckSquare2Icon,
  ClockIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import ChecklistItem from "./checklist-item";
import { ChecklistItem as ChecklistItemType } from "@/libs/types";

const CheckList = ({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: ChecklistItemType[] | [];
}) => {
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false); //for add an item ui
  const titleRef = useRef(null);
  const [checklistTitle, setChecklistTitle] = useState(title);

  useClickAway(titleRef, () => {
    setIsEditTitle(false);
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between ">
        <div className="flex flex-row gap-4 items-center" ref={titleRef}>
          <CheckSquare2Icon />
          {isEditTitle ? (
            <Input
              placeholder="Enter checklist title..."
              value={checklistTitle}
              className="text-xl font-medium "
              onChange={(e) => setChecklistTitle(e.target.value)}
            />
          ) : (
            <h3
              className="text-lg font-medium"
              onClick={() => setIsEditTitle(true)}
            >
              {title}
            </h3>
          )}
        </div>
        <Button variant={"destructive"}>
          <Trash2Icon />
          Delete
        </Button>
      </div>
      <div className="flex flex-col">
        <span className="text-sm">10%</span>
        <Progress value={10} />
      </div>
      <div className="ml-4 flex flex-col gap-3">
        {items?.map((item, i) => (
          <ChecklistItem key={item.id} data={item} />
        ))}
      </div>
      <div>
        {isOpenCreate ? (
          <form className=" ml-10 flex flex-col gap-2">
            <Input placeholder="Add an item" />
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <Button
                  type="submit"
                  size={"sm"}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Add
                </Button>
                <Button
                  onClick={() => setIsOpenCreate(false)}
                  size={"sm"}
                  variant={"outline"}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" size={"sm"} variant={"ghost"}>
                  <ClockIcon />
                  Due Date
                </Button>
                <Button size={"sm"} variant={"ghost"} type="button">
                  <UserPlusIcon />
                  Assign Member
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <Button onClick={() => setIsOpenCreate(true)} size={"sm"}>
            Add an item
          </Button>
        )}
      </div>
    </div>
  );
};

export default CheckList;
