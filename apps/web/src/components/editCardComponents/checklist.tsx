"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";

import { Input } from "../ui/input";
import { useClickAway } from "@/hooks/use-click-away";
import {
  CheckSquare2Icon,
  ClockIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import ChecklistItem from "./checklist-item";
import {
  AssignMember,
  ChecklistItem as ChecklistItemType,
  UserType,
} from "@/libs/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  CREATE_CHECKLIST_ITEM,
  DELETE_CHECKLIST,
  UPDATE_CHECKLIST,
} from "@/libs/utils/queryStringGraphql";
import toast from "react-hot-toast";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { Popover, PopoverContent, PopoverTrigger } from "../modern-ui/popover";
import AssignMemberChecklistItemContent from "./assignMember-checklist-item-content";
import AvatarGroup from "../avatar-group";
import DueDateContent from "./dueDate-content";

const CheckList = ({
  id,
  title,
  items,
  boardId,
  cardId,
}: {
  id: string;
  title: string;
  items: ChecklistItemType[] | [];
  boardId: string;
  cardId: string;
}) => {
  const queryClient = useQueryClient();
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false); //for add an item ui
  const titleRef = useRef(null);
  const [checklistTitle, setChecklistTitle] = useState<string>(title);
  const checklistTitleDebounced = useDebounce(checklistTitle, 300);
  const [itemName, setItemName] = useState("");
  const [progress, setProgress] = useState(0);
  const [_items, set_items] = useState(items);
  {
    /** just show in popover. no take to real database*/
  }
  const [itemDueDate, setItemDueDate] = useState<Date | undefined>(new Date());
  {
    /** real checklist item dueDate preview and take to database  */
  }
  const [previewItemDueDate, setPreviewItemDueDate] = useState<Date | null>(
    null,
  );
  const [selectedChecklistItemMembers, setSelectedChecklistItemMembers] =
    useState<AssignMember[] | []>([]);

  useClickAway(titleRef, () => {
    setIsEditTitle(false);
  });

  useEffect(() => {
    if (
      checklistTitleDebounced &&
      checklistTitleDebounced !== title &&
      checklistTitleDebounced.length > 0
    ) {
      updateChecklist.mutate({ title: checklistTitleDebounced });
    }
  }, [checklistTitleDebounced]);

  const updateChecklist = useMutation({
    mutationFn: async ({ title }: { title: string }) =>
      await fetchWithAuth(UPDATE_CHECKLIST, { title, id, boardId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const removeChecklist = useMutation({
    mutationFn: async () =>
      await fetchWithAuth(DELETE_CHECKLIST, { id, boardId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong.");
    },
  });

  const createChecklistItem = useMutation({
    mutationFn: async ({
      content,
      checklistId,
      boardId,
      dueDate,
      memberIds = [],
    }: {
      content: string;
      checklistId: string;
      dueDate?: Date;
      boardId: string;
      memberIds: string[] | [];
    }) =>
      await fetchWithAuth(CREATE_CHECKLIST_ITEM, {
        content,
        checklistId,
        boardId,
        dueDate,
        memberIds,
      }),
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      setItemName("");
    },
  });

  const onSubmitCreateItem = (e: FormEvent) => {
    e.preventDefault();
    if (itemName.length === 0) return;
    createChecklistItem.mutate({
      content: itemName,
      boardId,
      checklistId: id,
      dueDate: previewItemDueDate ?? undefined,
      memberIds: selectedChecklistItemMembers.map((m) => m.id),
    });
    setPreviewItemDueDate(null);
    setSelectedChecklistItemMembers([]);
  };

  const calculateProgressBar = () => {
    const itemCount = _items.length;
    const markedCount = _items.filter((i) => i.isCompleted).length;
    setProgress(Math.ceil((markedCount / itemCount) * 100));
  };

  useEffect(() => {
    if (_items.length > 0) {
      calculateProgressBar();
    }
  }, [_items]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between ">
        <div className="flex flex-row gap-4 items-center" ref={titleRef}>
          <CheckSquare2Icon />
          {isEditTitle ? (
            <Input
              placeholder="Enter checklist title..."
              value={checklistTitle}
              className="text-xl font-medium "
              onChange={(e) => setChecklistTitle(e.target.value)}
            />
          ) : (
            <h3
              className="text-lg font-medium"
              onClick={() => setIsEditTitle(true)}
            >
              {title}
            </h3>
          )}
        </div>
        <Button
          variant={"destructive"}
          disabled={removeChecklist.isPending}
          onClick={() => removeChecklist.mutate()}
        >
          <Trash2Icon />
          {removeChecklist.isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>
      <div className="flex flex-col">
        <span className="text-sm">{progress}%</span>
        <Progress value={progress} />
      </div>
      <div className="ml-4 flex flex-col gap-3">
        {_items?.map((item, i) => (
          <ChecklistItem
            key={item.id}
            data={item}
            boardId={boardId}
            cardId={cardId}
            onMarkClick={({ id, isCompleted }) => {
              set_items((prev) =>
                prev.map((i) => (i.id === id ? { ...i, isCompleted } : i)),
              );
            }}
          />
        ))}
      </div>
      <div>
        {isOpenCreate ? (
          <form
            className=" ml-10 flex flex-col gap-2"
            onSubmit={onSubmitCreateItem}
          >
            <Input
              placeholder="Add an item"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <Button
                  type="submit"
                  size={"sm"}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  disabled={createChecklistItem.isPending}
                >
                  {createChecklistItem.isPending ? "Adding..." : "Add"}
                </Button>
                <Button
                  onClick={() => {
                    setIsOpenCreate(false);
                    setSelectedChecklistItemMembers([]);
                  }}
                  size={"sm"}
                  variant={"outline"}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" size={"sm"} variant={"ghost"}>
                      <ClockIcon />
                      {previewItemDueDate
                        ? previewItemDueDate.toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Due Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <DueDateContent
                      date={itemDueDate}
                      setDate={setItemDueDate}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        onClick={() =>
                          setPreviewItemDueDate(itemDueDate as Date)
                        }
                        className="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Add
                      </Button>
                      {previewItemDueDate && (
                        <Button
                          onClick={() => setPreviewItemDueDate(null)}
                          className="bg-orange-600 text-white hover:bg-orange-700"
                        >
                          Remove Date
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                {selectedChecklistItemMembers &&
                selectedChecklistItemMembers.length > 0 ? (
                  <AvatarGroup
                    users={selectedChecklistItemMembers.map(
                      (m) => m.user as UserType,
                    )}
                    content={
                      <AssignMemberChecklistItemContent
                        boardId={boardId}
                        selectedMembers={selectedChecklistItemMembers}
                        setSelectedMembers={setSelectedChecklistItemMembers}
                      />
                    }
                  />
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size={"sm"} variant={"ghost"} type="button">
                        <UserPlusIcon />
                        Assign Member
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <AssignMemberChecklistItemContent
                        boardId={boardId}
                        selectedMembers={selectedChecklistItemMembers}
                        setSelectedMembers={setSelectedChecklistItemMembers}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </form>
        ) : (
          <Button onClick={() => setIsOpenCreate(true)} size={"sm"}>
            Add an item
          </Button>
        )}
      </div>
    </div>
  );
};

export default CheckList;
