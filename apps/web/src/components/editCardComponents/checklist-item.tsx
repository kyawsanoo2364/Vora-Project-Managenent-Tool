"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ClockIcon, Trash2Icon, UserPlus2Icon } from "lucide-react";
import { Input } from "../ui/input";
import {
  AssignMember,
  ChecklistItem as ChecklistItemType,
  UserType,
} from "@/libs/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  ADD_ASSIGN_MEMBER_IN_CHECKLIST_ITEM,
  DELETE_CHECKlIST_ITEM,
  REMOVE_ASSIGNED_MEMBER_FROM_CHECKLIST_ITEM,
  UPDATE_CHECK_LIST_ITEM,
} from "@/libs/utils/queryStringGraphql";
import toast from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from "../modern-ui/popover";
import DueDateContent from "./dueDate-content";
import AvatarGroup from "../avatar-group";
import AssignMemberChecklistItemContent from "./assignMember-checklist-item-content";

interface Props {
  data: ChecklistItemType;
  boardId: string;
  cardId: string;
}

const ChecklistItem = ({ data, boardId, cardId }: Props) => {
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [content, setContent] = useState(data.content);
  const [checked, setChecked] = useState(data.isCompleted);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    data?.dueDate ? new Date(data.dueDate) : new Date(),
  );
  const [selectedChecklistItemMembers, setSelectedChecklistItemMembers] =
    useState<AssignMember[]>(data?.assignMembers);

  const removeChecklistItem = useMutation({
    mutationFn: async ({ id, boardId }: { id: string; boardId: string }) =>
      await fetchWithAuth(DELETE_CHECKlIST_ITEM, { id, boardId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({
      content,

      dueDate,
      isCompleted,
    }: {
      content?: string;

      dueDate?: Date | null;
      isCompleted?: boolean;
    }) =>
      await fetchWithAuth(UPDATE_CHECK_LIST_ITEM, {
        id: data.id,
        content,

        dueDate,
        boardId,
        isCompleted,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      setIsEdit(false);
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const onUpdate = () => {
    updateItem.mutate({ content });
  };

  const onCheckedMark = (value: boolean) => {
    setChecked(value);
    updateItem.mutate({ isCompleted: value });
  };

  const updateDueDate = (date: Date | null) => {
    updateItem.mutate({ dueDate: date });
  };

  const addAssignMember = useMutation({
    mutationFn: async ({ memberId }: { memberId: string }) =>
      await fetchWithAuth(ADD_ASSIGN_MEMBER_IN_CHECKLIST_ITEM, {
        id: data.id,
        boardId,
        memberId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const removeAssignedMember = useMutation({
    mutationFn: async ({ memberId }: { memberId: string }) =>
      await fetchWithAuth(REMOVE_ASSIGNED_MEMBER_FROM_CHECKLIST_ITEM, {
        id: data.id,
        boardId,
        memberId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-row items-center gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={(checked) => onCheckedMark(!!checked)}
        />
        {isEdit ? (
          <div className="p-4 flex flex-col gap-4 w-full border rounded-md ">
            <Input
              placeholder="Edit item name..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex items-center  justify-between">
              <div className="flex items-center gap-2 ">
                <Button
                  onClick={onUpdate}
                  disabled={updateItem.isPending}
                  size={"sm"}
                >
                  {updateItem.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  size={"sm"}
                  onClick={() => setIsEdit(false)}
                  variant={"outline"}
                >
                  Cancel
                </Button>
              </div>
              {/* <div className="flex items-center gap-2">
                <Button variant={"ghost"} size={"icon-sm"}>
                  <ClockIcon />
                </Button>
                <Button variant={"ghost"} size={"icon-sm"}>
                  <UserPlus2Icon />
                </Button>
                <Button variant={"ghost"} size={"icon-sm"}>
                  <Trash2Icon />
                </Button>
              </div> */}
            </div>
          </div>
        ) : (
          <div className=" p-2 flex flex-row items-center hover:bg-gray-500/10 w-full justify-between rounded-md cursor-pointer">
            <h3
              className="text-base font-medium w-full"
              onClick={() => setIsEdit(true)}
            >
              {data.content}
            </h3>
            <div className="flex flex-row items-center gap-2">
              {/**Due Date  */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"ghost"} size={"sm"}>
                    <ClockIcon />
                    {data?.dueDate && (
                      <span>
                        {new Date(data?.dueDate).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <DueDateContent date={dueDate} setDate={setDueDate} />
                  <div className="flex items-center gap-2 mt-2">
                    {data?.dueDate &&
                      dueDate &&
                      dueDate?.getTime() !==
                        new Date(data.dueDate).getTime() && (
                        <Button
                          size={"sm"}
                          className="bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => updateDueDate(dueDate)}
                          disabled={updateItem.isPending}
                        >
                          Update
                        </Button>
                      )}
                    {data?.dueDate && (
                      <Button
                        size={"sm"}
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => updateDueDate(null)}
                        disabled={updateItem.isPending}
                      >
                        Remove
                      </Button>
                    )}
                    {!data.dueDate && dueDate && (
                      <Button
                        size={"sm"}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => updateDueDate(dueDate)}
                        disabled={updateItem.isPending}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {/** Assign Member */}
              {data?.assignMembers?.length > 0 ? (
                <AvatarGroup
                  users={data.assignMembers.map((a) => a.user) as UserType[]}
                  content={
                    <AssignMemberChecklistItemContent
                      boardId={boardId}
                      selectedMembers={selectedChecklistItemMembers}
                      setSelectedMembers={setSelectedChecklistItemMembers}
                      onClickMember={(id: string) =>
                        addAssignMember.mutate({ memberId: id })
                      }
                      onRemoveSelectedMember={(id: string) =>
                        removeAssignedMember.mutate({ memberId: id })
                      }
                    />
                  }
                />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"ghost"} size={"sm"}>
                      <UserPlus2Icon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <AssignMemberChecklistItemContent
                      boardId={boardId}
                      selectedMembers={selectedChecklistItemMembers}
                      setSelectedMembers={setSelectedChecklistItemMembers}
                      onClickMember={(id: string) =>
                        addAssignMember.mutate({ memberId: id })
                      }
                      onRemoveSelectedMember={(id: string) =>
                        removeAssignedMember.mutate({ memberId: id })
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
              <Button
                variant={"destructive"}
                size={"sm"}
                disabled={removeChecklistItem.isPending}
                onClick={() =>
                  removeChecklistItem.mutate({ id: data.id, boardId })
                }
              >
                <Trash2Icon />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistItem;
