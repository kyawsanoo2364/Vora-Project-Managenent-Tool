"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn, initialAvatarText } from "@/libs/utils/helpers";
import { SmilePlusIcon } from "lucide-react";
import RichTextEditor from "../rich-text-editor";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { GET_ALL_ACTIVITIES_BY_CARD_ID } from "@/libs/utils/queryStringGraphql";
import { ActivityType } from "@/libs/types";
import { formatDistanceToNow } from "date-fns";

const CommentsActivitiesSection = ({
  cardId,
  boardId,
}: {
  cardId: string;
  boardId: string;
}) => {
  const activitiesQuery = useQuery({
    queryKey: ["activities", cardId],
    queryFn: async () =>
      (await fetchWithAuth(GET_ALL_ACTIVITIES_BY_CARD_ID, { cardId, boardId }))
        ?.getAllActivitiesByCardId as ActivityType[],
  });

  return (
    <div className="flex flex-col gap-2">
      {/** comment item */}
      {/* <CommentItem />
      <CommentItem /> */}
      {/** activity item */}
      {activitiesQuery.data?.map((a, i) => (
        <ActivityItem key={i} data={a} />
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

const ActivityItem = ({ data }: { data: ActivityType }) => {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-slate-500 ml-9">
        {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}
      </span>
      <div className="flex flex-row gap-2">
        <Avatar>
          <AvatarImage src={data.user.avatar} alt={data.user.firstName} />
          <AvatarFallback className="bg-blue-500">
            {initialAvatarText(`${data.user.firstName} ${data.user.lastName}`)}
          </AvatarFallback>
        </Avatar>

        <p className="text-sm">
          <strong>{`${data.user.firstName} ${data.user.lastName}`}</strong>{" "}
          {data.action}
        </p>
      </div>
    </div>
  );
};
