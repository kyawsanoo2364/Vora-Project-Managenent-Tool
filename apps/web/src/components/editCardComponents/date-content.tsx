"use client";

import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../modern-ui/label";
import { Calendar28 } from "../calender28";
import { Button } from "../ui/button";
import { UPDATE_CARD } from "@/libs/utils/queryStringGraphql";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type DateContentProps = {
  cardId: string;
  boardId: string;
  startDateData?: Date;
  dueDateData?: Date;
};

const DateContent = ({
  cardId,
  boardId,
  startDateData,
  dueDateData,
}: DateContentProps) => {
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState(startDateData || new Date());
  const [dueDate, setDueDate] = useState(dueDateData || new Date());
  const [isCheckedStartDate, setIsCheckedStartDate] = useState(
    !!startDateData || false,
  );
  const [isCheckedDueDate, setIsCheckedDueDate] = useState(true);

  const updateCardMutation = useMutation({
    mutationFn: async ({
      id,
      startDate,
      dueDate,
    }: {
      id: string;
      startDate?: string | null;
      dueDate: string | null;
    }) =>
      await fetchWithAuth(UPDATE_CARD, {
        id,
        boardId,
        startDate,
        dueDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const onSave = () => {
    if (!isCheckedDueDate && !isCheckedStartDate) {
      if (dueDate || startDateData) {
        updateCardMutation.mutate({
          id: cardId,
          dueDate: null,
          startDate: null,
        });
      }
      return;
    }
    if (!isCheckedStartDate && isCheckedDueDate) {
      updateCardMutation.mutate({
        id: cardId,
        dueDate: dueDate.toISOString(),
        startDate: null,
      });
    } else {
      updateCardMutation.mutate({
        id: cardId,
        startDate: startDate.toISOString(),
        dueDate: dueDate.toISOString(),
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-medium text-center">Dates</h3>
      <div className="flex flex-col gap-2">
        <Label>Start Date</Label>
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            checked={isCheckedStartDate}
            onCheckedChange={() => setIsCheckedStartDate(!isCheckedStartDate)}
          />
          <Calendar28
            date={startDate}
            onDateChange={setStartDate}
            disabled={!isCheckedStartDate}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Due Date</Label>
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            checked={isCheckedDueDate}
            onCheckedChange={() => setIsCheckedDueDate(!isCheckedDueDate)}
          />
          <Calendar28
            date={dueDate}
            onDateChange={setDueDate}
            disabled={!isCheckedDueDate}
          />
        </div>
      </div>
      <Button
        className="bg-blue-500 text-white hover:bg-blue-600"
        onClick={onSave}
        disabled={updateCardMutation.isPending}
      >
        Save
      </Button>
    </div>
  );
};

export default DateContent;
