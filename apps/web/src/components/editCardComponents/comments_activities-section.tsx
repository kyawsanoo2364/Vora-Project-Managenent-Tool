"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn, initialAvatarText } from "@/libs/utils/helpers";
import { SmilePlusIcon } from "lucide-react";
import RichTextEditor from "../rich-text-editor";
import { Button } from "../ui/button";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  GET_ALL_ACTIVITIES_BY_CARD_ID,
  GET_ALL_COMMENTS,
  REMOVE_COMMENT,
  UPDATE_COMMENT,
} from "@/libs/utils/queryStringGraphql";
import { ActivityType, CommentType } from "@/libs/types";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/libs/providers/auth.provider";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../modern-ui/popover";

const CommentsActivitiesSection = ({
  cardId,
  boardId,
}: {
  cardId: string;
  boardId: string;
}) => {
  const {
    data: comments,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", cardId],
    queryFn: async ({ pageParam = null }) =>
      (
        await fetchWithAuth(GET_ALL_COMMENTS, {
          cardId,
          boardId,
          cursor: pageParam,
          take: 10,
        })
      )?.comments,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
  });

  const activitiesQuery = useQuery({
    queryKey: ["activities", cardId],
    queryFn: async () =>
      (await fetchWithAuth(GET_ALL_ACTIVITIES_BY_CARD_ID, { cardId, boardId }))
        ?.getAllActivitiesByCardId as ActivityType[],
  });

  return (
    <div className="flex flex-col gap-2">
      {/** comment item */}
      {comments?.pages
        ?.flatMap((page) => page?.items)
        ?.map((comment: CommentType, i) => (
          <CommentItem
            key={comment.id}
            data={comment}
            boardId={boardId}
            cardId={cardId}
          />
        ))}

      {/** activity item */}
      {activitiesQuery.data?.map((a, i) => (
        <ActivityItem key={i} data={a} />
      ))}
    </div>
  );
};

export default CommentsActivitiesSection;

const CommentItem = ({
  data,
  boardId,
  cardId,
}: {
  data: CommentType;
  boardId: string;
  cardId: string;
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [seeAll, setSeeAll] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isOverflowing, setIsOverFlowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [content, setContent] = useState(data.content);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const isTextOverflow = el.scrollHeight > el.clientHeight + 2;

    setIsOverFlowing(isTextOverflow);
  }, [data.content]);

  const updateCommentMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) =>
      await fetchWithAuth(UPDATE_COMMENT, { id: data.id, boardId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", cardId] });
      setIsEdit(false);

      toast.success("Comment updated successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async () =>
      await fetchWithAuth(REMOVE_COMMENT, { id: data.id, boardId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", cardId] });
      setIsDeleteOpen(false);
      toast.success("Comment removed successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const onUpdateComment = async () => {
    if (content === data.content || text.length === 0) {
      setIsEdit(false);
      return;
    }
    updateCommentMutation.mutate({ content });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2">
        <Avatar>
          <AvatarImage src={data.user.avatar} alt={data.user.firstName} />
          <AvatarFallback className="bg-blue-500">
            {initialAvatarText(`${data.user.firstName} ${data.user.lastName}`)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <h3 className="text-base font-semibold">{`${data.user.firstName} ${data.user.lastName}`}</h3>
            <span className="text-xs text-gray-600">
              {formatDistanceToNow(data.createdAt, { addSuffix: true })}
            </span>
          </div>
          {isEdit ? (
            <RichTextEditor
              onValueChange={setContent}
              value={content}
              onTextChange={setText}
            />
          ) : (
            <div className={cn("text-sm text-slate-300")}>
              <div
                ref={contentRef}
                className={cn(!seeAll && "line-clamp-2")}
                dangerouslySetInnerHTML={{ __html: data.content }}
              ></div>
              {isOverflowing && (
                <>
                  {!seeAll && (
                    <button
                      onClick={() => setSeeAll(true)}
                      className="font-medium text-sm hover:bg-gray-500/10 rounded-md p-1"
                    >
                      see more
                    </button>
                  )}
                  {seeAll && (
                    <button
                      onClick={() => setSeeAll(false)}
                      className="font-medium text-sm hover:bg-gray-500/10 rounded-md p-1"
                    >
                      see less
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {!isEdit && (
        <div className="flex flex-row gap-2 pl-11">
          <button className="text-sm hover:bg-gray-500/10 p-1 rounded-md">
            <SmilePlusIcon className="size-4" />
          </button>
          {data.user.id === user?.id && (
            <>
              <button
                onClick={() => setIsEdit(true)}
                className="text-sm underline hover:bg-gray-500/10 p-1 rounded-md"
              >
                Edit
              </button>
              <Popover open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <PopoverTrigger asChild>
                  <button className="text-sm underline hover:bg-gray-500/10 p-1 rounded-md">
                    Delete
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <h2 className="text-sm font-medium text-center">
                    Are you sure you want to delete this comment?
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size={"sm"}
                      variant={"destructive"}
                      disabled={deleteCommentMutation.isPending}
                      onClick={() => deleteCommentMutation.mutate()}
                    >
                      {deleteCommentMutation.isPending
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                    <Button
                      onClick={() => setIsDeleteOpen(false)}
                      size={"sm"}
                      variant={"outline"}
                    >
                      Cancel
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      )}
      {isEdit && (
        <div className="flex flex-row gap-2 items-center pl-11 mt-2">
          <Button
            onClick={onUpdateComment}
            disabled={updateCommentMutation.isPending}
          >
            {updateCommentMutation.isPending ? "Saving..." : "Save"}
          </Button>
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
