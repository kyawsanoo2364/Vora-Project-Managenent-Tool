"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PlusIcon } from "lucide-react";
import { UserType } from "@/libs/types";
import { initialAvatarText } from "@/libs/utils/helpers";
import { Popover, PopoverContent, PopoverTrigger } from "./modern-ui/popover";

type Props = {
  users: UserType[] | [];
  content?: React.ReactNode;
};

const AvatarGroup = ({ users, content }: Props) => {
  return (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale items-center">
      {users?.slice(0, 3).map((user, i) => (
        <Avatar key={i} className="relative size-6">
          <AvatarImage src={user?.avatar} alt={user.firstName} />
          <AvatarFallback className="bg-blue-500">
            {initialAvatarText(`${user.firstName} ${user.lastName}`)}
          </AvatarFallback>
          {i === 2 && (
            <Popover>
              <PopoverTrigger asChild>
                <div className="absolute cursor-pointer inset-0 bg-black/60 flex items-center justify-center ">
                  <PlusIcon className="size-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent>{content}</PopoverContent>
            </Popover>
          )}
        </Avatar>
      ))}
      {users.length < 3 && (
        <Popover>
          <PopoverTrigger asChild>
            <div className="rounded-full size-7 bg-gray-700 cursor-pointer flex items-center justify-center">
              <PlusIcon className="size-4" />
            </div>
          </PopoverTrigger>
          <PopoverContent>{content}</PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default AvatarGroup;
