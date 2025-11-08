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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { CREATE_CHECKLIST } from "@/libs/utils/queryStringGraphql";
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

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.length === 0) return;
    createChecklist.mutate({ title });
  };

  const createChecklist = useMutation({
    mutationFn: async ({ title }: { title: string }) =>
      await fetchWithAuth(CREATE_CHECKLIST, { title, cardId, boardId }),
    onError: (e) => {
      toast.error(e.message || "Something went wrong!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
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
        <Select defaultValue="none">
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">(none)</SelectItem>
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
