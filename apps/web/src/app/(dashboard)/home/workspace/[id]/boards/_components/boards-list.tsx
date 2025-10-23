"use client";

import { Select, TextField } from "@radix-ui/themes";
import { Label } from "@radix-ui/themes/dist/cjs/components/context-menu";
import { SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import BoardItem, { BoardItemSkeleton } from "./board-item";
import CreateBoardDialog from "./create-board-dialog";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { GET_ALL_BOARDS } from "@/libs/utils/queryStringGraphql";
import { GetBoardDataType } from "@/libs/types";
import { Button } from "@/components/modern-ui/button";
import { useDebounce } from "@/libs/hooks/useDebounce";

const BoardsList = ({ workspaceId }: { workspaceId: string }) => {
  const [sort, setSort] = useState<string>("most_recently");
  const [search, setSearch] = useState<string | null>(null);

  const debouncedSearchValue = useDebounce(search, 300);
  const { data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["boards", workspaceId, sort, debouncedSearchValue],
    queryFn: async ({ pageParam = null }) =>
      (
        await fetchWithAuth(GET_ALL_BOARDS, {
          workspaceId,
          take: 8,
          cursor: pageParam,
          sort,
          search: debouncedSearchValue || null,
        })
      ).getAllBoards,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    enabled: !!workspaceId,
  });

  const onChangeSearchValue = (value: string) => {
    setSearch(value);
  };

  return (
    <>
      <h2 className="text-lg font-semibold mt-4">Lists</h2>
      <div className="my-4 flex w-full  items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm">Sort By</Label>

          <Select.Root
            defaultValue="most_recently"
            value={sort}
            onValueChange={(value) => {
              setSort(value);
            }}
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="most_recently">Most recently</Select.Item>
              <Select.Item value="least_recently">Least recently</Select.Item>
              <Select.Item value="a_to_z">A - Z</Select.Item>
              <Select.Item value="z_to_a">Z - A</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm">Search</Label>

          <TextField.Root
            placeholder="Search the boards…"
            value={(search as string) || ""}
            onChange={(e) => onChangeSearchValue(e.target.value)}
          >
            <TextField.Slot>
              <SearchIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
        </div>
      </div>
      <div className="grid  grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4">
        <CreateBoardDialog workspaceId={workspaceId} />{" "}
        {isFetching &&
          Array.from({ length: 8 }).map((_, i) => (
            <BoardItemSkeleton key={i} />
          ))}
        {!isFetching &&
          data?.pages
            ?.flatMap((page) => page.items)
            ?.map((data: GetBoardDataType, i: number) => (
              <BoardItem
                key={i}
                id={data.id}
                workspaceId={workspaceId}
                title={data.name}
                background={data.background}
                isStarred={data.starred.length > 0}
              />
            ))}
      </div>
      {hasNextPage && (
        <div className="flex w-full items-center justify-center mt-6">
          <Button
            variant={"ghost"}
            className="border border-gray-600"
            onClick={() => fetchNextPage()}
          >
            Load More...
          </Button>
        </div>
      )}
    </>
  );
};

export default BoardsList;
