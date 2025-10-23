"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/modern-ui/tooltip";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { cn } from "@/libs/utils/helpers";
import { TOGGLE_STARRED_BOARD } from "@/libs/utils/queryStringGraphql";
import { Card, Inset, Skeleton, Text } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StarIcon, Users2Icon } from "lucide-react";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  title: string;
  background: string;
  isStarred?: boolean;
  workspaceId: string;
  id: string;
};

export const BoardItemSkeleton = () => {
  return (
    <Card size={"2"}>
      <Skeleton width={"100%"} height={"70px"} />
      <Skeleton width={"100%"} height={"40px"} mt={"2"}></Skeleton>
    </Card>
  );
};

const BoardItem = ({
  id,
  workspaceId,
  title,
  background,
  isStarred,
}: Props) => {
  const [loaderId, setLoaderId] = useState("");
  const queryClient = useQueryClient();
  const toggleStarred = useMutation({
    mutationFn: async () =>
      await fetchWithAuth(TOGGLE_STARRED_BOARD, { workspaceId, boardId: id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["starredBoards", workspaceId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["boards", workspaceId],
      });
      toast.dismiss(loaderId);
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update starred");
    },
  });

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
          <button
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => {
              toggleStarred.mutate();
              const toastId = toast.loading("Processing...");
              setLoaderId(toastId);
            }}
          >
            {isStarred ? (
              <StarIcon className="size-4" fill="white" />
            ) : (
              <StarIcon className="size-4" />
            )}
          </button>
        </div>
      </Inset>
      <Link href={`/b/${id}`}>
        <Text as="p" size={"3"}>
          {title}
        </Text>
      </Link>
    </Card>
  );
};

export default BoardItem;
