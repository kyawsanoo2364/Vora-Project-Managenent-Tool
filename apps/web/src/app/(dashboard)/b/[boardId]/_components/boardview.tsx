"use client";

import { Button } from "@/components/modern-ui/button";
import { ScrollArea } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import React, { FormEvent, useEffect, useRef, useState } from "react";

import ListCard from "./listCard";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
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
  CREATE_LIST,
  GET_LISTS,
  UPDATE_LIST,
} from "@/libs/utils/queryStringGraphql";
import toast from "react-hot-toast";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/modern-ui/popover";
import { Input } from "@/components/modern-ui/input";
import { ListType } from "@/libs/types";
import { useMount } from "@/hooks/use-mount";
import { useBoardMember } from "@/libs/providers/board.member.provider";

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
  const [createListName, setCreateListName] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { member } = useBoardMember();
  const createListMutation = useMutation({
    mutationFn: async ({ name, boardId }: { name: string; boardId: string }) =>
      (await fetchWithAuth(CREATE_LIST, { name, boardId }))
        ?.createList as ListType,
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const updateListMutation = useMutation({
    mutationFn: async ({
      id,
      orderIndex,
    }: {
      id: string;
      orderIndex: number;
    }) => await fetchWithAuth(UPDATE_LIST, { id, orderIndex, boardId }),
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const [cards, setCards] = useState<ListType[]>([]);
  const [isCreateList, setIsCreateList] = useState(false);
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
    setCards((tasks) => {
      const originalPos = getTaskPos(active.id, tasks);
      const newPos = getTaskPos(over?.id, tasks);
      return arrayMove(tasks, originalPos, newPos);
    });

    await updateListMutation.mutateAsync({
      id: active.id as string,
      orderIndex: getTaskPos(over?.id, cards),
    });
  };

  const addList = async (e: FormEvent) => {
    e.preventDefault();
    if (createListName.trim().length === 0) return;
    const newList = await createListMutation.mutateAsync({
      name: createListName,
      boardId,
    });
    setIsCreateList(true);
    setCards([...cards, newList]);
    setCreateListName("");
  };

  useEffect(() => {
    if (isCreateList && scrollRef?.current) {
      setIsCreateList(false);
      const element = scrollRef.current;
      element.scrollTo({
        left: element.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [isCreateList]);

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
          ref={scrollRef}
          style={{
            height: "82vh",
            whiteSpace: "nowrap", // Key for horizontal list items
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
                items={cards.map((list) => list.id)}
              >
                {cards?.map((task, i) => (
                  <ListCard key={task.id} id={task.id} title={task.name} />
                ))}
              </SortableContext>
            )}
            {member?.role !== "VIEWER" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button size={"sm"} className="w-60 flex items-center gap-2">
                    <PlusIcon />
                    <span>Add List</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <h1 className="text-base font-medium">Create List</h1>
                  <form onSubmit={addList}>
                    <Input
                      placeholder="New List name..."
                      className="mt-4"
                      value={createListName}
                      onChange={(e) => setCreateListName(e.target.value)}
                    />
                    <Button
                      className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white hover:scale-102 transition duration-150 "
                      type="submit"
                      disabled={createListMutation.isPending}
                    >
                      {createListMutation.isPending ? "Adding..." : "Add List"}
                    </Button>
                  </form>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </ScrollArea>
      </div>
    </DndContext>
  );
};

export default BoardView;
