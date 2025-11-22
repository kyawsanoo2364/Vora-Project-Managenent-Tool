"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CommentsActivitiesSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* 3 comment skeletons */}
      {[1, 2, 3].map((i) => (
        <CommentSkeleton key={i} />
      ))}

      {/* 2 activity skeletons */}
      {[1, 2].map((i) => (
        <ActivitySkeleton key={i} />
      ))}
    </div>
  );
}

function CommentSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        {/* Avatar */}
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1 flex-1">
          {/* Name */}
          <Skeleton className="h-4 w-32" />
          {/* Time */}
          <Skeleton className="h-3 w-24" />
          {/* Comment content */}
          <Skeleton className="h-12 w-full mt-2" />
          {/* Reaction pills */}
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-6 w-10 rounded-full" />
            <Skeleton className="h-6 w-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pl-12 mt-2">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="flex flex-col">
      {/* Time */}
      <Skeleton className="h-3 w-24 ml-12" />

      <div className="flex flex-row gap-2 mt-1">
        {/* Avatar */}
        <Skeleton className="h-10 w-10 rounded-full" />

        <div className="flex flex-col gap-1">
          {/* Activity text */}
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
}
