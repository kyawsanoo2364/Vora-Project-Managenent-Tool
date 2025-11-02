"use client";

import { Button } from "@/components/modern-ui/button";
import { cn } from "@/libs/utils/helpers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusIcon } from "lucide-react";
import React, { FormEvent, useLayoutEffect, useRef, useState } from "react";
import ListCardEllipsis from "./listCardComponents/listCard-ellipsis";
import CardItem from "./cards/card-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/modern-ui/popover";
import { Input } from "@/components/modern-ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  CREATE_CARD,
  GET_CARDS_BY_LIST_ID,
} from "@/libs/utils/queryStringGraphql";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  id: string;
  title: string;
}

const ListCard = ({ id, title }: Props) => {
  const [newCardName, setNewCardName] = useState("");
  const queryClient = useQueryClient();
  const params = useParams();

  const {
    listeners,
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    transition: {
      duration: 150, // milliseconds
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (cardRef.current && !isDragging) {
      setHeight(cardRef.current.offsetHeight);
    }
  }, [isDragging]);

  const cardsQuery = useQuery({
    queryKey: ["cards", "list", id],
    queryFn: async () =>
      (await fetchWithAuth(GET_CARDS_BY_LIST_ID, { listId: id }))
        ?.getCardsByListId,
  });

  const addCardMutation = useMutation({
    mutationFn: async ({
      title,
      listId,
      boardId,
    }: {
      title: string;
      listId: string;
      boardId: string;
    }) => await fetchWithAuth(CREATE_CARD, { title, listId, boardId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", "list", id] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, scaleY: 1 } : null,
    ),
    transition,
    height: isDragging && height ? `${height}px` : undefined,
    zIndex: isDragging ? 50 : "auto",
    position: isDragging ? ("relative" as const) : undefined,
    willChange: "transform",
  };

  const onAddCardSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newCardName.trim().length === 0) return;

    await addCardMutation.mutateAsync({
      title: newCardName,
      listId: id,
      boardId: params.boardId as string,
    });
    setNewCardName("");
  };

  return (
    <div
      ref={(el) => {
        cardRef.current = el;
        setNodeRef(el);
      }}
      style={style}
      className={cn(
        " flex flex-col gap-3 w-full md:w-72 bg-[#2C333A]  rounded-md text-gray-100  cursor-grab pb-1",
        isDragging && "cursor-grabbing opacity-50",
      )}
    >
      <div
        className="flex items-center justify-between px-4 pt-2"
        {...attributes}
        {...listeners}
      >
        <h3 className="text-base w-full font-semibold truncate max-w-[120px]">
          {title}
        </h3>
        <ListCardEllipsis />
      </div>
      <ScrollArea className=" w-full scroll-smooth">
        <div className="flex flex-col  gap-2 p-2 max-h-80">
          {!cardsQuery.isLoading &&
            cardsQuery?.data?.map((item: any, i: number) => (
              <CardItem key={item.id} title={item.title} id={item.id} />
            ))}
        </div>
      </ScrollArea>

      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-full flex flex-row gap-2 bg-transparent hover:bg-gray-400/10 text-white">
            <PlusIcon />
            <span>Add Card</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <form onSubmit={onAddCardSubmit}>
            <Input
              placeholder="Card Name..."
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
            />
            <Button
              className="mt-2 text-sm"
              size={"sm"}
              type="submit"
              disabled={addCardMutation.isPending}
            >
              {addCardMutation.isPending ? "Adding..." : "Add Card"}
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ListCard;
