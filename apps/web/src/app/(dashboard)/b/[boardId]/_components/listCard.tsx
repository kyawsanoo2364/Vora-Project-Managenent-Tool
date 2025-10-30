"use client";

import { Button } from "@/components/modern-ui/button";
import { cn } from "@/libs/utils/helpers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusIcon } from "lucide-react";
import React, { FormEvent, useState } from "react";
import ListCardEllipsis from "./listCardComponents/listCard-ellipsis";
import CardItem from "./cards/card-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/modern-ui/popover";
import { Input } from "@/components/modern-ui/input";

interface Props {
  id: string;
  title: string;
}

const ListCard = ({ id, title }: Props) => {
  const [newCardName, setNewCardName] = useState("");
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

  const onAddCardSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newCardName.trim().length === 0) return;
    console.log(newCardName);
    setNewCardName("");
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: "none" }}
      className={cn(
        " flex flex-col gap-3 w-full md:w-72 bg-[#2C333A] rounded-md text-gray-100  cursor-grab pb-1",
        isDragging && "cursor-grabbing",
      )}
    >
      <div
        className="flex items-center justify-between px-4 pt-2"
        {...attributes}
        {...listeners}
      >
        <h3 className="text-base w-full font-semibold truncate max-w-[120px]">
          {title}
        </h3>
        <ListCardEllipsis />
      </div>
      <ScrollArea className=" w-full scroll-smooth">
        <div className="flex flex-col  gap-2 p-2 max-h-80">
          {/* <CardItem /> */}
        </div>
      </ScrollArea>

      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-full flex flex-row gap-2 bg-transparent hover:bg-gray-400/10 text-white">
            <PlusIcon />
            <span>Add Card</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <form onSubmit={onAddCardSubmit}>
            <Input
              placeholder="Card Name..."
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
            />
            <Button className="mt-2 text-sm" size={"sm"} type="submit">
              Add Card
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ListCard;
