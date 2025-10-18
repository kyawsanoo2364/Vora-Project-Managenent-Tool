"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/modern-ui/tooltip";
import { cn } from "@/libs/utils/helpers";
import { Card, Inset, Text } from "@radix-ui/themes";
import { Users2Icon } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  title: string;
  background: string;
};

const BoardItem = ({ title, background }: Props) => {
  return (
    <Card
      className="cursor-pointer hover:bg-gray-500/10 hover:scale-102 transition duration-300"
      size={"2"}
    >
      <Inset clip={"padding-box"} side={"top"} pb={"current"}>
        <div
          className={cn(
            "w-full relative h-15  rounded-sm",
            !background.includes("#") && background,
          )}
          style={
            background.includes("#")
              ? { backgroundColor: background }
              : undefined
          }
        >
          <div className="absolute inset-0 bg-black/20" />
          <Tooltip>
            <TooltipTrigger className="absolute bottom-1 left-1 ">
              <Users2Icon className="size-5" />
            </TooltipTrigger>
            <TooltipContent>
              All members of workspace can see and edit this board.
            </TooltipContent>
          </Tooltip>
        </div>
      </Inset>
      <Text as="p" size={"3"}>
        {title}
      </Text>
    </Card>
  );
};

export default BoardItem;
