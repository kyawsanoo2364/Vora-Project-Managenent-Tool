"use client";

import { Button } from "@/components/modern-ui/button";
import { ScrollArea } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import ListCard from "./listCard";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { cn, getTaskPos } from "@/libs/utils/helpers";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  GET_BOARD,
  GET_LISTS,
  UPDATE_LIST,
} from "@/libs/utils/queryStringGraphql";

const BoardView = ({
  boardId,
  board: listData,
}: {
  boardId: string;
  board: any;
}) => {
  const getLists = useQuery({
    queryKey: ["list", boardId],
    queryFn: async () => (await fetchWithAuth(GET_LISTS, { boardId }))?.list,
  });

  const updateListMutation = useMutation({
    mutationFn: async ({
      id,
      orderIndex,
    }: {
      id: string;
      orderIndex: number;
    }) => await fetchWithAuth(UPDATE_LIST, { id, orderIndex }),
  });

  const [cards, setCards] = useState<any[]>([]);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (getLists.data) {
      setCards(getLists.data);
    }
  }, [getLists.data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id === over?.id) {
      return;
    }
    const originalPos = getTaskPos(active.id, cards);
    const newPos = getTaskPos(over?.id, cards);
    setCards((tasks) => {
      return arrayMove(tasks, originalPos, newPos);
    });

    await updateListMutation.mutateAsync({
      id: active.id as string,
      orderIndex: newPos,
    });
    if (over) {
      await updateListMutation.mutateAsync({
        id: over.id as string,
        orderIndex: originalPos,
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div
        className={cn(
          "h-screen w-screen ",
          !listData?.background.includes("#") && listData?.background,
        )}
        style={
          listData?.background.includes("#")
            ? { backgroundColor: listData?.background }
            : undefined
        }
      >
        <ScrollArea
          type="always"
          scrollbars={isDesktop ? "both" : "vertical"}
          size={"3"}
          style={{
            height: "82vh",
          }}
          className="p-4"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start ">
            {!getLists.isLoading && (
              <SortableContext
                strategy={
                  isDesktop
                    ? horizontalListSortingStrategy
                    : verticalListSortingStrategy
                }
                items={cards}
              >
                {cards?.map((task, i) => (
                  <ListCard key={i} id={task.id} title={task.name} />
                ))}
              </SortableContext>
            )}
            <Button size={"sm"} className="w-60 flex items-center gap-2">
              <PlusIcon />
              <span>Add List</span>
            </Button>
          </div>
        </ScrollArea>
      </div>
    </DndContext>
  );
};

export default BoardView;
