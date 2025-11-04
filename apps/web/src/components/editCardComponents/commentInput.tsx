"use client";

import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { initialAvatarText } from "@/libs/utils/helpers";

import RichTextEditor from "../rich-text-editor";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useClickAway } from "@/hooks/use-click-away";

const CommentInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useClickAway(inputRef, (e) => {
    setIsOpen(false);
  });

  return (
    <div className="w-full flex flex-col gap-2" ref={inputRef}>
      <div className="flex  gap-2 flex-row">
        <Avatar>
          <AvatarImage src={""} alt="" />
          <AvatarFallback className="bg-blue-500">
            {initialAvatarText("Kyaw San")}
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
      {isOpen && (
        <div className="pl-10">
          <Button
            size="sm"
            className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-secondary disabled:text-gray-600"
            disabled={text.trim().length === 0}
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
