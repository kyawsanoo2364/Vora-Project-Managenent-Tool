"use client";

import { Button } from "@/components/modern-ui/button";
import { Input } from "@/components/modern-ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/modern-ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClickAway } from "@/hooks/use-click-away";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { GetSingleBoardType } from "@/libs/types";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { cn } from "@/libs/utils/helpers";
import { UPDATE_BOARD } from "@/libs/utils/queryStringGraphql";
import { Skeleton } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import BoardInviteMemberDialog from "./board-invite-member-dialog";

const BoardViewNavbar = ({
  boardId,
  board,
  isLoading,
}: {
  boardId: string;
  board: GetSingleBoardType;
  isLoading: boolean;
}) => {
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [name, setName] = useState("");
  const [cacheName, setCacheName] = useState("");
  const debounced_name = useDebounce(name, 500) as string;
  const titleRef = useRef(null);

  const updateBoardTitleMutation = useMutation({
    mutationFn: async ({ name }: { name: string }) =>
      await fetchWithAuth(UPDATE_BOARD, { id: boardId, name }),
  });

  useEffect(() => {
    if (cacheName?.length === 0) {
      setCacheName(debounced_name);
      return;
    } else if (debounced_name?.length > 0 && debounced_name !== cacheName) {
      setCacheName(debounced_name);

      updateBoardTitleMutation.mutate({ name: debounced_name });
    } else if (debounced_name?.length === 0 && board?.name && !isEditTitle) {
      setName(cacheName);
    }
  }, [debounced_name, isEditTitle]);

  useEffect(() => {
    if (board?.name) {
      setName(board.name);
    }
  }, [board?.name]);

  useClickAway(titleRef, () => {
    if (isEditTitle) setIsEditTitle(false);
  });

  return (
    <div
      className={cn(
        "w-full h-12 p-2   border-b border-b-gray-400 ",
        board &&
          !board.background.includes("#") &&
          board.background + "bg-black",
      )}
      style={
        board?.background.includes("#")
          ? { backgroundColor: board.background }
          : undefined
      }
    >
      <div className="flex items-center justify-between container mx-auto">
        <div className="flex flex-row items-center gap-4">
          {isLoading ? (
            <Skeleton width={"80px"} height={"20px"} />
          ) : (
            <div ref={titleRef}>
              {isEditTitle ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-600"
                />
              ) : (
                <h2
                  className="text-lg font-semibold hover:bg-gray-200/20 px-4 cursor-pointer"
                  onClick={() => setIsEditTitle(true)}
                >
                  {debounced_name || cacheName}
                </h2>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          {isLoading ? (
            <div className="flex flex-row">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  width={"30px"}
                  height={"30px"}
                  style={{ borderRadius: "100%" }}
                />
              ))}
            </div>
          ) : (
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              {board?.members?.slice(0, 3).map((member) => (
                <Avatar className="size-6 cursor-pointer" key={member.id}>
                  <AvatarImage
                    src={member.user.avatar}
                    alt={member.user.fullName}
                  />
                  <AvatarFallback>
                    {member.user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {board?.members?.length > 3 && (
                <Avatar className="size-6 cursor-pointer">
                  <AvatarFallback className="text-[12px]">+4</AvatarFallback>
                </Avatar>
              )}
            </div>
          )}
          <BoardInviteMemberDialog members={board?.members} boardId={boardId} />
        </div>
      </div>
    </div>
  );
};

export default BoardViewNavbar;
