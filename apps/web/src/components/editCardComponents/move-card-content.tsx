"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../modern-ui/button";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  GET_ALL_BOARDS,
  GET_CURRENT_CARD_POS_AND_LIST,
  GET_LISTS,
} from "@/libs/utils/queryStringGraphql";
import { GetBoardDataType, ListType } from "@/libs/types";
import { Loader2Icon } from "lucide-react";

interface Props {
  boardId: string;
  cardId: string;
  listId: string;
  cardPos: number;
}

const MoveCardContent = ({ boardId, cardId, listId, cardPos }: Props) => {
  const [board, setBoard] = useState(boardId);
  const [list, setList] = useState(listId || "");
  const [position, setPosition] = useState(cardPos.toString() || "0");
  const [workspaceId, _] = useLocalStorage("vora_workspace_id", null);
  const { data: boards, isLoading } = useInfiniteQuery({
    queryKey: ["boards", workspaceId],
    queryFn: async ({ pageParam = null }) =>
      (await fetchWithAuth(GET_ALL_BOARDS, { workspaceId, cursor: pageParam }))
        ?.getAllBoards,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    enabled: !!workspaceId,
  });

  const getLists = useQuery({
    queryKey: ["list", board],
    queryFn: async () =>
      (await fetchWithAuth(GET_LISTS, { boardId: board }))?.list as ListType[],
  });
  useEffect(() => {
    if (board !== boardId && getLists.data) {
      setList(getLists.data[0].id);
    } else {
      setList(listId);
      setPosition(cardPos.toString());
    }
  }, [board, getLists?.data]);

  const currentList = getLists.data?.find((l) => l.id === list);
  const cards = currentList?.cards ?? [];

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-center">Move Card</h2>
      <p className="text-sm text-slate-500">Select Destination</p>
      {isLoading || getLists.isLoading ? (
        <div className="flex items-center justify-center my-2">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-col w-full">
            <span className="text-base">Board</span>
            <Select value={board} onValueChange={setBoard}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {boards?.pages
                  ?.flatMap((p) => p.items)
                  ?.map((board: GetBoardDataType, i: number) => (
                    <SelectItem key={board.id} value={board.id}>
                      {board.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 grid grid-cols-6 w-full gap-2">
            <div className="col-span-4 flex flex-col">
              <span className="text-base">List</span>
              <Select value={list} onValueChange={setList}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getLists.data?.map((list: ListType, i: number) => (
                    <SelectItem value={list.id} key={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 flex flex-col">
              <span className="text-base">Position</span>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cards.length > 0 ? (
                    Array.from({
                      length:
                        currentList?.id !== listId
                          ? cards.length + 1
                          : cards.length,
                    }).map((_, i) => (
                      <SelectItem value={i.toString()} key={i}>
                        {i + 1}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value={cardPos.toString()}>
                      {cardPos + 1}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            disabled={
              board === boardId &&
              list === listId &&
              position === cardPos.toString()
            }
            className="my-2 disabled:bg-gray-500 text-white bg-blue-500 hover:bg-blue-600"
          >
            Move
          </Button>
        </>
      )}
    </div>
  );
};

export default MoveCardContent;
