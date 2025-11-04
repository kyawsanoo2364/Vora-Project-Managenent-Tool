"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn, initialAvatarText } from "@/libs/utils/helpers";
import { SmilePlusIcon } from "lucide-react";
import RichTextEditor from "../rich-text-editor";
import { Button } from "../ui/button";

const CommentsActivitiesSection = () => {
  return (
    <div className="flex flex-col gap-3">
      {/** comment item */}
      <CommentItem />
      <CommentItem />
      {/** activity item */}
      {Array.from({ length: 10 }).map((_, i) => (
        <ActivityItem key={i} />
      ))}
    </div>
  );
};

export default CommentsActivitiesSection;

const CommentItem = () => {
  const [seeAll, setSeeAll] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2">
        <Avatar>
          <AvatarImage src={""} alt="" />
          <AvatarFallback>{initialAvatarText("San Lay")}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <h3 className="text-base font-semibold">San Lay</h3>
            <span className="text-sm text-gray-500">about 3 minutes ago</span>
          </div>
          {isEdit ? (
            <RichTextEditor />
          ) : (
            <p className={cn("text-sm text-slate-300")}>
              <span className={cn(!seeAll && "line-clamp-2")}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Doloremque soluta quia minima, tenetur perspiciatis expedita
                laboriosam consectetur neque magnam aut non beatae, quaerat
                labore. Vel repellendus doloribus ad modi qui? Lorem ipsum,
                dolor sit amet consectetur adipisicing elit. Quisquam maxime
                doloremque aspernatur, esse in aliquid asperiores doloribus
                ratione odio nostrum iste nobis, error, voluptatibus aliquam.
                Voluptate consequatur rerum totam nesciunt?{" "}
              </span>
              {!seeAll && (
                <button
                  onClick={() => setSeeAll(true)}
                  className="font-semibold hover:bg-gray-500/10 rounded-md p-1"
                >
                  see more
                </button>
              )}
              {seeAll && (
                <button
                  onClick={() => setSeeAll(false)}
                  className="font-semibold hover:bg-gray-500/10 rounded-md p-1"
                >
                  see less
                </button>
              )}
            </p>
          )}
        </div>
      </div>
      {!isEdit && (
        <div className="flex flex-row gap-2 pl-11">
          <button className="text-sm hover:bg-gray-500/10 p-1 rounded-md">
            <SmilePlusIcon className="size-4" />
          </button>
          <button
            onClick={() => setIsEdit(true)}
            className="text-sm underline hover:bg-gray-500/10 p-1 rounded-md"
          >
            Edit
          </button>
          <button className="text-sm underline hover:bg-gray-500/10 p-1 rounded-md">
            Delete
          </button>
        </div>
      )}
      {isEdit && (
        <div className="flex flex-row gap-2 items-center pl-11 mt-2">
          <Button>Save</Button>
          <Button variant={"outline"} onClick={() => setIsEdit(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

const ActivityItem = () => {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-slate-500 ml-9">3 hours ago</span>
      <div className="flex flex-row gap-2">
        <Avatar>
          <AvatarImage src={""} alt="" />
          <AvatarFallback className="bg-blue-500">
            {initialAvatarText("Kyaw San")}
          </AvatarFallback>
        </Avatar>

        <p className="text-sm">
          <strong>Kyaw San Oo</strong> Lorem ipsum dolor sit amet consectetur
          adipisicing elit. At aliquam aspernatur quo dolore velit dolor.
        </p>
      </div>
    </div>
  );
};
