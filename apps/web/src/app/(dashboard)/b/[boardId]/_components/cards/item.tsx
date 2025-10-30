"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/modern-ui/tooltip";

import React from "react";

type Props = {
  icon: React.ReactNode;
  content: string;
  label: string;
};

const Item = ({ content, label, icon }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-center gap-1 text-gray-400">
          {icon}
          <span className="text-sm">{content}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default Item;
