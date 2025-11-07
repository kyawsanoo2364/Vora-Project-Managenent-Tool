import { Skeleton } from "@/components/ui/skeleton";

export default function CardDetailsSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4 mt-4 animate-in fade-in-0 duration-300">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Skeleton className="h-5 w-5 rounded-md" /> {/* checkbox */}
          <Skeleton className="h-6 w-48 rounded-md" /> {/* title */}
        </div>
      </div>

      {/* Feature buttons */}
      <div className="flex flex-row items-center flex-wrap gap-2 mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-lg" />
        ))}
        <Skeleton className="h-8 w-28 rounded-lg" /> {/* priority select */}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>

        {/* Description body */}
        <Skeleton className="h-24 w-full rounded-md mt-2" />
      </div>

      {/* Attachments */}
      <div className="flex flex-col gap-2 mt-4">
        <Skeleton className="h-5 w-24 rounded-md" /> {/* section title */}
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-28 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Checklists */}
      <div className="flex flex-col gap-3 mt-4">
        <Skeleton className="h-5 w-24 rounded-md" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-5 w-32 rounded-md" />
            </div>
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex items-center gap-2 ml-6">
                <Skeleton className="h-4 w-4 rounded-sm" />
                <Skeleton className="h-4 w-44 rounded-md" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
