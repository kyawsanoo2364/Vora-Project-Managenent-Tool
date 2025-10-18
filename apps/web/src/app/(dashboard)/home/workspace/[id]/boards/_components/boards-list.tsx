"use client";

import { Grid, Select, TextField } from "@radix-ui/themes";
import { Label } from "@radix-ui/themes/dist/cjs/components/context-menu";
import { PlusIcon, SearchIcon } from "lucide-react";
import React from "react";
import BoardItem from "./board-item";
import CreateBoardDialog from "./create-board-dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { GET_ALL_BOARDS } from "@/libs/utils/queryStringGraphql";
import { GetBoardDataType } from "@/libs/types";

const BoardsList = ({ workspaceId }: { workspaceId: string }) => {
  const getAllBoards = useQuery({
    queryKey: ["boards", workspaceId],
    queryFn: async () => await fetchWithAuth(GET_ALL_BOARDS, { workspaceId }),
  });

  return (
    <>
      <div className="my-4 flex w-full items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm">Sort By</Label>
          <Select.Root defaultValue="most_recently">
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
          <TextField.Root placeholder="Search the boards…">
            <TextField.Slot>
              <SearchIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
        </div>
      </div>
      <div className="grid  grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4">
        {getAllBoards?.data?.getAllBoards?.map(
          (data: GetBoardDataType, i: number) => (
            <BoardItem key={i} title={data.name} background={data.background} />
          ),
        )}

        <CreateBoardDialog workspaceId={workspaceId} />
      </div>
    </>
  );
};

export default BoardsList;
