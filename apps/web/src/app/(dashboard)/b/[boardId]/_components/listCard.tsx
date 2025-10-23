"use client";

import { Button } from "@/components/modern-ui/button";
import { cn } from "@/libs/utils/helpers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusIcon } from "lucide-react";
import React from "react";

interface Props {
  id: string;
  title: string;
}

const ListCard = ({ id, title }: Props) => {
  const {
    listeners,
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    transition: {
      duration: 150, // milliseconds
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={{ ...style, touchAction: "none" }}
      className={cn(
        "p-4 flex flex-col gap-3 w-full md:w-72 bg-[#2C333A] rounded-md text-gray-100 select-none cursor-grab",
        isDragging && "cursor-grabbing",
      )}
    >
      <h3 className="text-base font-semibold">{title}</h3>
      <Button className="w-full flex flex-row gap-2 bg-transparent hover:bg-gray-400/10 text-white">
        <PlusIcon />
        <span>Add Card</span>
      </Button>
    </div>
  );
};

export default ListCard;
