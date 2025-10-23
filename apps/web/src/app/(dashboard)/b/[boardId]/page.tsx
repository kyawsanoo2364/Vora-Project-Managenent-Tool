"use client";

import React from "react";
import BoardView from "./_components/boardview";
import BoardViewNavbar from "./_components/boardview-navbar";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { GET_BOARD } from "@/libs/utils/queryStringGraphql";

const BoardPage = () => {
  const { boardId } = useParams();
  const getBoard = useQuery({
    queryKey: ["board", boardId],
    queryFn: async () => (await fetchWithAuth(GET_BOARD, { boardId })).getBoard,
  });

  return (
    <div className="flex flex-col  w-full h-full">
      <BoardViewNavbar
        boardId={boardId as string}
        board={getBoard?.data}
        isLoading={getBoard.isLoading}
      />

      <BoardView boardId={boardId as string} board={getBoard?.data} />
    </div>
  );
};

export default BoardPage;
