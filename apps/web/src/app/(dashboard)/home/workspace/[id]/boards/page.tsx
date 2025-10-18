import { ScrollArea } from "@radix-ui/themes";

import React from "react";
import BoardsList from "./_components/boards-list";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Boards | Vora",
};

const BoardsPage = async ({ params }: Props) => {
  const workspaceId = (await params).id;

  return (
    <ScrollArea
      scrollbars="vertical"
      className="w-full  flex flex-col gap-4 p-4 "
      style={{ height: "100vh" }}
    >
      <h2 className="text-xl md:text-2xl font-semibold">Boards</h2>
      <BoardsList workspaceId={workspaceId} />
    </ScrollArea>
  );
};

export default BoardsPage;
