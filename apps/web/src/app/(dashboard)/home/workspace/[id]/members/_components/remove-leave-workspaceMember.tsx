"use client";

import { Button } from "@/components/modern-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/modern-ui/popover";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  isOwn?: boolean;
  onClick?: () => void;
  isButtonLoading?: boolean;
}>;

const RemoveLeaveWorkspaceMember = ({
  children,

  isOwn,
  isButtonLoading,
  onClick,
}: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <h2 className="text-base font-semibold">
          {isOwn ? "Leave Workspace" : "Remove Member "}
        </h2>
        {isOwn ? (
          <p className="mt-2 text-gray-400 text-sm">
            You will become a guest of this Workspace and will only be able to
            access boards you are currently a member of.
          </p>
        ) : (
          <p className="mt-2 text-gray-400 text-sm">
            This action removes the member from the workspace. They will still
            retain access to boards where they are a member. A notification will
            be sent.
          </p>
        )}

        <Button
          variant={"destructive"}
          className="w-full my-2"
          onClick={onClick}
          disabled={isButtonLoading}
        >
          {isOwn
            ? isButtonLoading
              ? "Leaving..."
              : "Leave"
            : isButtonLoading
              ? "Removing Member..."
              : "Remove Member"}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default RemoveLeaveWorkspaceMember;
