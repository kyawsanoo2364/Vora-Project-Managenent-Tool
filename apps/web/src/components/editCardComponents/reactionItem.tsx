"use client";

import { cn } from "@/libs/utils/helpers";
import React, { useEffect, useState } from "react";

interface ReactionItemProps {
  isActive?: boolean;
  emoji: string;
  count: number;
  onClick?: () => void;
}

const ReactionItem = ({
  isActive,
  emoji,
  count,
  onClick,
}: ReactionItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-fit px-2 py-1 cursor-pointer rounded-full flex items-center gap-2 text-xs bg-gray-500/10",
        isActive && "bg-blue-400",
      )}
    >
      <span>{emoji}</span>
      <span>{count}</span>
    </div>
  );
};

export default ReactionItem;
