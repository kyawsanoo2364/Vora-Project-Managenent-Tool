"use client";

import {
  ArchiveIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  ImageIcon,
  LayoutTemplateIcon,
  UserPlus2Icon,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "../modern-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../modern-ui/popover";
import MoveCardContent from "./move-card-content";
import CoverCardContent from "./cover-card-content";
import { useQuery } from "@tanstack/react-query";
import {
  GET_BOARD,
  GET_CURRENT_CARD_POS_AND_LIST,
} from "@/libs/utils/queryStringGraphql";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { CardPosAndListType, GetBoardDataType } from "@/libs/types";

interface Props {
  boardId: string;
  cardId: string;
}

const CoverHeaderTool = ({ boardId, cardId }: Props) => {
  const [isOpenMoveCardContent, setIsOpenMoveCardContent] = useState(false);
  const getCardPosAndListId = useQuery({
    queryKey: ["cardPosAndList", cardId],
    queryFn: async () =>
      (await fetchWithAuth(GET_CURRENT_CARD_POS_AND_LIST, { cardId }))
        ?.getCurrentCardPosAndList as CardPosAndListType,
  });
  const getBoard = useQuery({
    queryKey: ["board", boardId],
    queryFn: async () =>
      (await fetchWithAuth(GET_BOARD, { boardId }))
        ?.getBoard as GetBoardDataType,
  });

  return (
    <div className="absolute top-0 right-0 left-0 px-3 py-2 flex w-full justify-between items-center">
      {/**left */}
      <div className="flex items-center gap-2">
        {getBoard.isLoading ? (
          <div className="px-2 py-1 rounded-md text-sm bg-gray-600 flex items-center">
            <div className="h-4 w-20 bg-gray-500/60 rounded animate-pulse" />
            <ChevronDownIcon className="size-4 ml-1 opacity-50" />
          </div>
        ) : (
          <Popover
            open={isOpenMoveCardContent}
            onOpenChange={setIsOpenMoveCardContent}
          >
            <PopoverTrigger asChild>
              <div className="px-2 py-1 rounded-md text-sm bg-gray-600 flex items-center cursor-pointer">
                {getBoard.data?.name}
                <ChevronDownIcon className="size-4" />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <MoveCardContent
                boardId={boardId}
                cardId={cardId}
                listId={getCardPosAndListId.data?.listId as string}
                cardPos={getCardPosAndListId.data?.orderIndex || 0}
                onSuccess={() => setIsOpenMoveCardContent(false)}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
      {/**right */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"ghost"}>
              <ImageIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <CoverCardContent />
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <UserPlus2Icon />
              Join
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ArrowRightIcon />
              Move
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LayoutTemplateIcon />
              Make Template
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ArchiveIcon />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CoverHeaderTool;
