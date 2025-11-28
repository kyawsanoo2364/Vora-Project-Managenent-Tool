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
import Image from "next/image";
import useImageColor from "@/hooks/use-image-color";
import { cn } from "@/libs/utils/helpers";
import { Button } from "../ui/button";
import CoverHeaderTool from "../editCardComponents/coverHeaderTool";

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

  const { color, isLoading: isColorLoading } = useImageColor(
    dataQuery?.data?.cover?.media.url || "",
  );

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className={cn(
          "w-full h-[10vh] flex items-center justify-center backdrop-blur-md relative",
          dataQuery.data?.cover && "h-[20vh]",
        )}
        style={
          dataQuery.data?.cover
            ? {
                objectFit: "cover",
                backgroundColor: color || "",
              }
            : undefined
        }
      >
        {/** header toolbar */}
        <CoverHeaderTool boardId={boardId} cardId={cardId as string} />
        {/**Cover Image */}
        {dataQuery?.data?.cover && !isColorLoading && color && (
          <Image
            src={dataQuery.data.cover.media.url}
            alt={dataQuery.data.cover.media.filename}
            width={200}
            height={200}
            className="object-contain h-full "
          />
        )}
      </div>
      <div className={cn(" w-full grid lg:grid-cols-5 grid-cols-1")}>
        <ScrollArea
          className={cn(
            "h-[80vh] w-full p-4 lg:col-span-3",
            dataQuery.data?.cover && "h-[70vh]",
          )}
        >
          {dataQuery.isLoading || boardIdLoading ? (
            <CardDetailsSkeleton />
          ) : dataQuery.data ? (
            <CardDetails data={dataQuery.data} boardId={boardId} />
          ) : null}
        </ScrollArea>
        <ScrollArea
          className={cn(
            "h-[80vh] w-full p-4 lg:col-span-2",
            dataQuery.data?.cover && "h-[70vh]",
          )}
        >
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row items-center gap-2">
              <MessageSquareIcon className="size-5" />
              <h3 className="text-lg font-semibold">Comments and Activities</h3>
            </div>
            <CommentInput cardId={cardId as string} boardId={boardId} />
            {dataQuery.data && (
              <CommentsActivitiesSection
                cardId={dataQuery.data.id}
                boardId={boardId}
              />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default EditCardView;
