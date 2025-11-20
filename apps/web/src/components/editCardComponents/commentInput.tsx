"use client";

import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { initialAvatarText } from "@/libs/utils/helpers";

import RichTextEditor from "../rich-text-editor";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useClickAway } from "@/hooks/use-click-away";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { CREATE_COMMENT } from "@/libs/utils/queryStringGraphql";
import toast from "react-hot-toast";
import { useAuth } from "@/libs/providers/auth.provider";

const CommentInput = ({
  cardId,
  boardId,
}: {
  cardId: string;
  boardId: string;
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const createCommentMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) =>
      await fetchWithAuth(CREATE_COMMENT, { cardId, boardId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", cardId] });
      setIsOpen(false);
      setComment("");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  useClickAway(inputRef, (e) => {
    setIsOpen(false);
  });

  const onCreate = () => {
    if (text.length === 0) return;
    createCommentMutation.mutate({ content: comment });
  };

  return (
    <div className="w-full flex flex-col gap-2" ref={inputRef}>
      {user && (
        <div className="flex  gap-2 flex-row">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.firstName} />
            <AvatarFallback className="bg-blue-500">
              {initialAvatarText(user?.fullName as string)}
            </AvatarFallback>
          </Avatar>
          {isOpen ? (
            <RichTextEditor
              value={comment}
              onValueChange={setComment}
              onTextChange={setText}
              className="max-h-[80px] min-h-[80px]"
            />
          ) : (
            <div onClick={() => setIsOpen(true)} className="w-full">
              <Input placeholder="Add a comment" disabled />
            </div>
          )}
        </div>
      )}
      {isOpen && (
        <div className="pl-10 flex items-center gap-2">
          <Button
            size="sm"
            className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-secondary disabled:text-gray-600"
            disabled={
              text.trim().length === 0 || createCommentMutation.isPending
            }
            onClick={onCreate}
          >
            {createCommentMutation.isPending ? "Adding..." : "Add"}
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
