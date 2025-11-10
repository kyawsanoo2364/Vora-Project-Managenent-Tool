"use client";

import { MessageSquareIcon } from "lucide-react";

import { ScrollArea } from "../ui/scroll-area";

import { Card, Priority } from "@/libs/types";

import CommentInput from "../editCardComponents/commentInput";

import CommentsActivitiesSection from "../editCardComponents/comments_activities-section";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  GET_BOARD_ID_FROM_CARD,
  GET_CARD_BY_ID,
} from "@/libs/utils/queryStringGraphql";
import CardDetailsSkeleton from "../editCardComponents/cardDetails-skeleton";
import CardDetails from "../editCardComponents/cardDetails";

export const PRIORITIES: Priority[] = [
  { label: "Low", color: "#22c55e" }, // green
  { label: "Medium", color: "#eab308" }, // yellow
  { label: "High", color: "#f97316" }, // orange
  { label: "Urgent", color: "#ef4444" }, // red
];

const EditCardView = () => {
  const cardId = useParams().cardId;

  const { data: boardId, isLoading: boardIdLoading } = useQuery({
    queryKey: ["get_boardId_from_card", cardId],
    queryFn: async () =>
      (await fetchWithAuth(GET_BOARD_ID_FROM_CARD, { cardId }))
        ?.getBoardIdFromCard,
  });

  const dataQuery = useQuery({
    queryKey: ["card", cardId],
    queryFn: async () =>
      (await fetchWithAuth(GET_CARD_BY_ID, { id: cardId }))
        ?.getCardById as Card,
  });

  return (
    <div className=" w-full    grid md:grid-cols-2 grid-cols-1">
      <ScrollArea className="h-[90vh] w-full p-4">
        {dataQuery.isLoading || boardIdLoading ? (
          <CardDetailsSkeleton />
        ) : dataQuery.data ? (
          <CardDetails data={dataQuery.data} boardId={boardId} />
        ) : null}
      </ScrollArea>
      <ScrollArea className="h-[90vh] w-full p-4">
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-row items-center gap-2">
            <MessageSquareIcon className="size-5" />
            <h3 className="text-lg font-semibold">Comments and Activities</h3>
          </div>
          <CommentInput />
          {dataQuery.data && (
            <CommentsActivitiesSection
              cardId={dataQuery.data.id}
              boardId={boardId}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditCardView;
