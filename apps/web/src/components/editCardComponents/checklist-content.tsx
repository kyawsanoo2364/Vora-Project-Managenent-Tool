"use client";

import React, { FormEvent, useState } from "react";
import { Input } from "../modern-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../modern-ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  CREATE_CHECKLIST,
  DUPLICATE_CHECKLIST,
  GET_ALL_CHECKLIST_BY_BOARD,
} from "@/libs/utils/queryStringGraphql";
import toast from "react-hot-toast";

const ChecklistContent = ({
  cardId,
  boardId,
}: {
  cardId: string;
  boardId: string;
}) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [selectedChecklist, setSelectedChecklist] = useState("none");

  const checklistsQuery = useQuery({
    queryKey: ["checklistsByBoardId", boardId],
    queryFn: async () =>
      (await fetchWithAuth(GET_ALL_CHECKLIST_BY_BOARD, { boardId }))
        ?.getAllChecklistByBoardId as { id: string; title: string }[],
  });

  const duplicateChecklist = useMutation({
    mutationFn: async ({
      checklistId,
      title,
    }: {
      checklistId: string;
      title: string;
    }) =>
      await fetchWithAuth(DUPLICATE_CHECKLIST, {
        checklistId,
        boardId,
        cardId,
        title,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
      setTitle("");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.length === 0) return;
    if (selectedChecklist === "none") {
      createChecklist.mutate({ title });
    } else {
      duplicateChecklist.mutate({ checklistId: selectedChecklist, title });
    }
  };

  const createChecklist = useMutation({
    mutationFn: async ({ title }: { title: string }) =>
      await fetchWithAuth(CREATE_CHECKLIST, { title, cardId, boardId }),
    onError: (e) => {
      toast.error(e.message || "Something went wrong!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
      setTitle("");
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h3 className="w-full text-center text-sm">Add Checklist</h3>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Input
          placeholder="Checkbox title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Select value={selectedChecklist} onValueChange={setSelectedChecklist}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">(none)</SelectItem>
            {checklistsQuery.data?.map((checklist, i) => (
              <SelectItem value={checklist.id} key={i}>
                {checklist.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button disabled={createChecklist.isPending} className="max-w-[80px]">
          {createChecklist.isPending ? "Adding..." : "Add"}
        </Button>
      </form>
    </div>
  );
};

export default ChecklistContent;
