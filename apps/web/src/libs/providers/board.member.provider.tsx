"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { BoardMemberType } from "../types";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { GET_CURRENT_BOARD_MEMBER } from "../utils/queryStringGraphql";
import { Spinner } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/use-localstorage";

type BoardMemberContextType = {
  isLoading: boolean;
  member: BoardMemberType | undefined;
};

const BoardMemberContext = createContext<BoardMemberContextType>({
  isLoading: false,
  member: undefined,
});

export const useBoardMember = () => {
  const context = useContext(BoardMemberContext);
  if (!context) throw new Error("Board Id is required for provider.");
  return context;
};

const BoardMemberProvider = ({
  children,
  boardId,
}: PropsWithChildren<{ boardId: string }>) => {
  const router = useRouter();
  const [getDefaultWorkspaceId] = useLocalStorage("vora_workspace_id", null);
  const { data, isLoading } = useQuery({
    queryKey: ["current_board_member", boardId],
    queryFn: async () =>
      (await fetchWithAuth(GET_CURRENT_BOARD_MEMBER, { boardId }))
        .getCurrentBoardMember,
  });
  useEffect(() => {
    if (!isLoading && (!data || typeof data === "undefined")) {
      router.push(`/home/workspace/${getDefaultWorkspaceId}`);
    }
  }, [isLoading, data, getDefaultWorkspaceId, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Spinner size={"3"} />
        <h3 className="text-slate-500 text-xl font-medium">Loading...</h3>
      </div>
    );
  }

  return (
    <BoardMemberContext.Provider value={{ member: data, isLoading }}>
      {children}
    </BoardMemberContext.Provider>
  );
};

export default BoardMemberProvider;
