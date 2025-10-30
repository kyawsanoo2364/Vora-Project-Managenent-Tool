"use client";

import { Button } from "@/components/modern-ui/button";

import { EditIcon, MessageSquareIcon } from "lucide-react";
import React, { useId, useState } from "react";
import Item from "./item";

import { Checkbox } from "@/components/ui/checkbox";

const CardItem = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const checkboxId = useId();
  return (
    <div className="w-full flex flex-col gap-2 bg-gray-600/20 p-2 rounded-sm hover:ring-2 hover:ring-gray-100 group  ">
      <div className="w-full flex flex-row justify-between items-center">
        <label htmlFor={checkboxId} className="flex items-center gap-2">
          <Checkbox
            id={checkboxId} // Add an ID for accessibility
            checked={isCompleted} // Controlled component: Read the state
            onCheckedChange={() => setIsCompleted(!isCompleted)} // Controlled
          />
          <span className="text-gray-300 transition duration-300 truncate max-w-[150px] cursor-pointer">
            Hello world
          </span>
        </label>

        <Button variant={"ghost"} className="hover:bg-gray-400/20">
          <EditIcon className="size-3" />
        </Button>
      </div>
      <div className="flex flex-row flex-wrap gap-2 items-center  ">
        {Array.from({ length: 3 }).map((_, i) => (
          <Item
            key={i}
            content="3"
            icon={<MessageSquareIcon className="size-4" />}
            label="Comments"
          />
        ))}
      </div>
    </div>
  );
};

export default CardItem;
