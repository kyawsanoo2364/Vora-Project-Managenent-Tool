"use client";

import React, { useEffect, useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useClickAway } from "@/hooks/use-click-away";
import {
  ClockIcon,
  EditIcon,
  LinkIcon,
  ListCheckIcon,
  LogsIcon,
  PlusIcon,
  UserPlusIcon,
} from "lucide-react";
import ChecklistContent from "./checklist-content";
import AttachmentContent from "./attachment-content";
import MemberContent from "./member-content";
import DateContent from "./date-content";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../modern-ui/popover";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PRIORITIES } from "../views/editCardView";
import RichTextEditor from "../rich-text-editor";
import CheckList from "./checklist";
import { Card } from "@/libs/types";
import { ScrollArea } from "../ui/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { UPDATE_CARD } from "@/libs/utils/queryStringGraphql";
import toast from "react-hot-toast";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { initialAvatarText } from "@/libs/utils/helpers";
import Attachment from "./attachment";

type UpdateCardArgsType = {
  id: string;

  title?: string;
  description?: string;
  priority?: string;
  startDate?: string | Date;
  dueDate?: string | Date;
  isCompleted?: boolean;
};

const CardDetails = ({ data, boardId }: { data: Card; boardId: string }) => {
  const queryClient = useQueryClient();
  const [isCompleted, setIsCompleted] = useState(data.isCompleted);
  const [title, setTitle] = useState(data.title);
  const titleDebounced = useDebounce(title, 300);
  const [isOpenTitleInput, setIsOpenTitleInput] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [priority, setPriority] = useState(data.priority);
  const titleRef = useRef(null);
  const [description, setDescription] = useState(data.description || "");
  const [descriptionText, setDescriptionText] = useState(data.description);
  useClickAway(titleRef, () => {
    if (isOpenTitleInput) setIsOpenTitleInput(false);
  });

  const featureItems = [
    {
      label: "CheckList",
      Icon: <ListCheckIcon className="size-4" />,
      content: <ChecklistContent cardId={data.id} boardId={boardId} />,
    },
    {
      label: "Attachment",
      Icon: <LinkIcon className="size-4" />,
      content: <AttachmentContent cardId={data.id} boardId={boardId} />,
    },
    {
      label: "Member",
      Icon: <UserPlusIcon className="size-4" />,
      content: (
        <MemberContent
          boardId={boardId}
          assignedMembers={data.assignMembers}
          cardId={data.id}
        />
      ),
    },
    {
      label: "Dates",
      Icon: <ClockIcon className="size-4" />,
      content: (
        <DateContent
          cardId={data.id}
          boardId={boardId}
          startDateData={data.startDate ? new Date(data.startDate) : undefined}
          dueDateData={data.dueDate ? new Date(data.dueDate) : undefined}
        />
      ),
    },
  ];

  const updateCardMutation = useMutation({
    mutationFn: async ({
      id,
      description,

      isCompleted,
      priority,

      title,
    }: UpdateCardArgsType) =>
      await fetchWithAuth(UPDATE_CARD, {
        id,
        boardId,
        description,

        isCompleted,
        priority,

        title,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["activities", data.id] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const onChangeCheckbox = async (value: boolean) => {
    setIsCompleted(value);
    await updateCardMutation.mutateAsync({ id: data.id, isCompleted: value });
  };

  useEffect(() => {
    if (
      titleDebounced !== data.title &&
      titleDebounced &&
      titleDebounced.length > 0
    ) {
      updateCardMutation.mutate({ id: data.id, title: titleDebounced });
    }
  }, [titleDebounced]);

  const updateDescription = async () => {
    if (descriptionText.length > 0) {
      await updateCardMutation.mutateAsync({ id: data.id, description });
    } else {
      await updateCardMutation.mutateAsync({
        id: data.id,
        description: descriptionText,
      });
    }
    setShowEditor(false);
  };

  const onChangePriority = (value: string) => {
    setPriority(value);
    updateCardMutation.mutate({ id: data.id, priority: value });
  };

  return (
    <div className="w-full flex flex-col gap-2 mt-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-row items-center gap-4" ref={titleRef}>
          <Checkbox
            className="cursor-pointer"
            checked={isCompleted}
            onCheckedChange={() => onChangeCheckbox(!isCompleted)}
          />
          {isOpenTitleInput ? (
            <Input
              placeholder="Enter title..."
              className="max-w-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            <h1
              onClick={() => setIsOpenTitleInput(true)}
              className="text-xl font-medium"
            >
              {data.title}
            </h1>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center flex-wrap gap-1">
        {featureItems.map((item, i) => (
          <Popover key={i}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                key={i}
                className="bg-gray-500/10 hover:bg-gray-500/20"
              >
                {item.Icon}
                <span>{item.label}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>{item.content}</PopoverContent>
          </Popover>
        ))}

        <Select value={priority} onValueChange={onChangePriority}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Priority</SelectLabel>
              {PRIORITIES.map((p, i) => (
                <SelectItem key={i} value={p.label}>
                  <span style={{ color: p.color }}>{p.label}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/** header data */}
      <div className="flex flex-row items-center gap-4 flex-wrap">
        {/** date data */}
        {data?.dueDate && (
          <div className="p-2 rounded-md text-[12px] border border-gray-600 flex flex-row gap-2 items-center">
            <ClockIcon className="size-3" />
            {data.startDate && (
              <>
                <span>
                  {" "}
                  {new Date(data.startDate).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span>-</span>
              </>
            )}
            <span>
              {new Date(data.dueDate).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}
        {/** members */}
        {data.assignMembers && data.assignMembers.length > 0 && (
          <div className="flex flex-row items-center flex-wrap">
            {data?.assignMembers?.map((m) => (
              <Avatar key={m.id} className="cursor-pointer">
                <AvatarImage src={m.user.avatar} alt={m.user.email} />
                <AvatarFallback className="bg-blue-500">
                  {initialAvatarText(`${m.user.firstName} ${m.user.lastName}`)}
                </AvatarFallback>
              </Avatar>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full p-2 bg-gray-400/10">
                  <PlusIcon className="size-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <MemberContent
                  assignedMembers={data.assignMembers}
                  boardId={boardId}
                  cardId={data.id}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      {/**Description */}
      <div className="flex flex-col gap-2 mt-2 ">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <LogsIcon className="text-slate-600 size-5" />

            <h3 className="font-medium text-xl text-slate-300">Description</h3>
          </div>
          {!showEditor && data.description && data.description?.length > 0 && (
            <Button
              variant={"ghost"}
              className="hover:bg-gray-200/10"
              onClick={() => setShowEditor(true)}
            >
              <EditIcon />
            </Button>
          )}
          {!showEditor &&
            !data.description &&
            data.description?.length === 0 && (
              <Button onClick={() => setShowEditor(true)}>
                <PlusIcon />
                <span>Add Description</span>
              </Button>
            )}
        </div>
        {!showEditor && data.description && data.description?.length > 0 && (
          <ScrollArea className="border border-gray-600 rounded-sm p-4 ">
            <div
              dangerouslySetInnerHTML={{ __html: data.description }}
              className="max-h-[200px]"
            />
          </ScrollArea>
        )}
        {showEditor && (
          <>
            <RichTextEditor
              value={description}
              onValueChange={setDescription}
              onTextChange={setDescriptionText}
            />
            <div className="flex flex-row items-center gap-2 mt-1">
              <Button
                onClick={updateDescription}
                disabled={updateCardMutation.isPending}
              >
                {updateCardMutation.isPending ? "Saving..." : "Save"}{" "}
              </Button>
              <Button
                variant={"outline"}
                onClick={() => setShowEditor(false)}
                className="bg-gray-500/20 hover:bg-gray-500/30"
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
      {/** Attachment */}
      {data.attachments?.length > 0 && (
        <Attachment
          data={data.attachments}
          cardId={data.id}
          boardId={boardId}
          className="my-4"
        />
      )}

      {/** Checklist */}
      <div className="flex flex-col gap-4 mt-2">
        {data.checklists?.map((checklist, i) => (
          <CheckList
            title={checklist.title}
            id={checklist.id}
            key={checklist.id}
            items={checklist.items}
            boardId={boardId}
            cardId={data.id}
          />
        ))}
      </div>
    </div>
  );
};

export default CardDetails;
