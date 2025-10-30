"use client";

import { Button } from "@/components/modern-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { EllipsisIcon } from "lucide-react";
import React from "react";

const ListCardEllipsis = () => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom">
        <DropdownMenuLabel className="w-full text-center">
          List actions
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>Add Card</DropdownMenuItem>
          <DropdownMenuItem>Copy List</DropdownMenuItem>
          <DropdownMenuItem>Move List</DropdownMenuItem>
          <Separator className="my-4" />
          <DropdownMenuItem>Archive this list</DropdownMenuItem>
          <DropdownMenuItem>Archive all cards in the list</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListCardEllipsis;
