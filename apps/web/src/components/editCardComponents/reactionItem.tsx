"use client";

import { cn } from "@/libs/utils/helpers";
import React, { useState } from "react";

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
  const [isReacted, setIsReacted] = useState(isActive);
  const [countNumber, setCountNumber] = useState(count);
  return (
    <div
      onClick={() => {
        if (isReacted) {
          setCountNumber(countNumber - 1);
        } else {
          setCountNumber(countNumber + 1);
        }
        setIsReacted(!isReacted);

        onClick?.();
      }}
      className={cn(
        "w-fit px-2 py-1 cursor-pointer rounded-full flex items-center gap-2 text-xs bg-gray-500/10",
        isReacted && "bg-blue-400",
      )}
    >
      <span>{emoji}</span>
      <span>{countNumber}</span>
    </div>
  );
};

export default ReactionItem;
