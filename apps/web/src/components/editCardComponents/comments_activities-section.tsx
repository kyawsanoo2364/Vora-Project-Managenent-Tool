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
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  GET_ALL_ACTIVITIES_BY_CARD_ID,
  GET_ALL_COMMENTS,
  REACTION_TO_COMMENT,
  REMOVE_COMMENT,
  UPDATE_COMMENT,
} from "@/libs/utils/queryStringGraphql";
import { ActivityType, CommentType } from "@/libs/types";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/libs/providers/auth.provider";
import toast from "react-hot-toast";

import { Popover, PopoverContent, PopoverTrigger } from "../modern-ui/popover";
import ReactionItem from "./reactionItem";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { CommentsActivitiesSkeleton } from "./comments_activity_skeleton";

const CommentsActivitiesSection = ({
  cardId,
  boardId,
}: {
  cardId: string;
  boardId: string;
}) => {
  const queryClient = useQueryClient();
  const {
    data: comments,
    hasNextPage,
    fetchNextPage,
    isLoading,
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

  const reactionToCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      emoji,
    }: {
      commentId: string;
      emoji: string;
    }) =>
      await fetchWithAuth(REACTION_TO_COMMENT, { commentId, emoji, boardId }),

    onError: (err) => {
      console.log(err);
    },
  });

  const activitiesQuery = useQuery({
    queryKey: ["activities", cardId],
    queryFn: async () =>
      (await fetchWithAuth(GET_ALL_ACTIVITIES_BY_CARD_ID, { cardId, boardId }))
        ?.getAllActivitiesByCardId as ActivityType[],
  });

  if (isLoading || activitiesQuery.isLoading)
    return <CommentsActivitiesSkeleton />;

  const timeline = [
    ...(comments?.pages?.flatMap((p) => p.items) ?? []).map((c) => ({
      type: "comment",
      data: c,
      createdAt: new Date(c.createdAt),
    })),
    ...(activitiesQuery.data ?? []).map((a) => ({
      type: "activity",
      data: a,
      createdAt: new Date(a.createdAt),
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="flex flex-col gap-2">
      {/** comment item */}
      {timeline.map((item, i) =>
        item.type === "comment" ? (
          <CommentItem
            key={item.data.id}
            data={item.data}
            boardId={boardId}
            cardId={cardId}
            reactionMutation={reactionToCommentMutation}
          />
        ) : (
          <ActivityItem key={i} data={item.data} />
        ),
      )}
    </div>
  );
};

export default CommentsActivitiesSection;

const CommentItem = ({
  data,
  boardId,
  cardId,
  reactionMutation,
}: {
  data: CommentType;
  boardId: string;
  cardId: string;
  reactionMutation: UseMutationResult<
    any,
    Error,
    {
      commentId: string;
      emoji: string;
    },
    unknown
  >;
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [seeAll, setSeeAll] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [reactions, setReactions] = useState(data.reactions);
  const [isOverflowing, setIsOverFlowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [content, setContent] = useState(data.content);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReactionOpen, setIsReactionOpen] = useState(false);

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

  const onReaction = (emoji: string) => {
    reactionMutation.mutate({ commentId: data.id, emoji });
  };

  const onReactionClick = (e: { emoji: string }) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === e.emoji);

      // CASE 1: User clicks the same reaction → toggle off
      if (existing?.reactedByUser) {
        return prev
          .map((r) =>
            r.emoji === e.emoji
              ? { ...r, count: r.count - 1, reactedByUser: false }
              : r,
          )
          .filter((r) => r.count > 0);
      }

      // CASE 2: User had a previous reaction → remove it first
      let updated = prev.map((r) =>
        r.reactedByUser
          ? { ...r, count: r.count - 1, reactedByUser: false }
          : r,
      );

      updated = updated.filter((r) => r.count > 0);

      // CASE 3: Add or update the new selected reaction
      if (existing) {
        return updated.map((r) =>
          r.emoji === e.emoji
            ? { ...r, count: r.count + 1, reactedByUser: true }
            : r,
        );
      }

      // New reaction entry
      return [...updated, { emoji: e.emoji, count: 1, reactedByUser: true }];
    });

    onReaction(e.emoji);
    setIsReactionOpen(false);
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
          <div className="flex items-center gap-1 flex-wrap">
            {reactions?.map((r) =>
              r.count > 0 ? (
                <ReactionItem
                  key={r.emoji}
                  emoji={r.emoji}
                  count={r.count}
                  isActive={r.reactedByUser}
                  onClick={() => onReactionClick(r)}
                />
              ) : null,
            )}
          </div>
        </div>
      </div>
      {!isEdit && (
        <div className="flex flex-row gap-2 pl-11">
          <Popover open={isReactionOpen} onOpenChange={setIsReactionOpen}>
            <PopoverTrigger asChild>
              <button className="text-sm hover:bg-gray-500/10 p-1 rounded-md">
                <SmilePlusIcon className="size-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="bg-transparent border-transparent shadow-none  p-0">
              <EmojiPicker
                height={300}
                width={300}
                theme={Theme.DARK}
                lazyLoadEmojis
                searchDisabled
                reactionsDefaultOpen
                emojiStyle={EmojiStyle.GOOGLE}
                onEmojiClick={onReactionClick}
              />
            </PopoverContent>
          </Popover>
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
