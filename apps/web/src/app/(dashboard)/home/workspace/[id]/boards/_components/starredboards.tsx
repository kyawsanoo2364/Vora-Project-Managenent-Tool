"use client";

import React from "react";
import BoardItem, { BoardItemSkeleton } from "./board-item";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { GET_STARRED_BOARDS } from "@/libs/utils/queryStringGraphql";
import { GetBoardDataType } from "@/libs/types";

const StarredBoards = ({ workspaceId }: { workspaceId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["starredBoards", workspaceId],
    queryFn: async () =>
      await fetchWithAuth(GET_STARRED_BOARDS, { workspaceId }),
  });

  if (
    !isLoading &&
    (!data.findStarredBoards || data.findStarredBoards.length <= 0)
  ) {
    return null;
  }

  return (
    <div className="my-4">
      <h2 className="text-lg font-semibold">Starred </h2>
      <div className="grid  grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <BoardItemSkeleton key={i} />
          ))}
        {!isLoading &&
          data?.findStarredBoards?.map((board: GetBoardDataType, i: number) => (
            <BoardItem
              id={board.id}
              workspaceId={workspaceId}
              title={board.name}
              background={board.background}
              key={board.id + i}
              isStarred
            />
          ))}
      </div>
    </div>
  );
};

export default StarredBoards;
