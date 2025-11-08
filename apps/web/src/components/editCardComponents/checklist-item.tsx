"use client";

import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ClockIcon, Trash2Icon, UserPlus2Icon } from "lucide-react";
import { Input } from "../ui/input";
import { ChecklistItem as ChecklistItemType } from "@/libs/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { string } from "zod";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { DELETE_CHECKlIST_ITEM } from "@/libs/utils/queryStringGraphql";
import toast from "react-hot-toast";

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

  const removeChecklistItem = useMutation({
    mutationFn: async ({ id, boardId }: { id: string; boardId: string }) =>
      await fetchWithAuth(DELETE_CHECKlIST_ITEM, { id, boardId }),
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
          onCheckedChange={(checked) => setChecked(!!checked)}
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
                <Button size={"sm"}>Save</Button>
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
              <Button variant={"ghost"} size={"sm"}>
                <ClockIcon />
              </Button>
              <Button variant={"ghost"} size={"sm"}>
                <UserPlus2Icon />
              </Button>
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
