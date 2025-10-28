import WorkspaceMemberProvider from "@/libs/providers/workspace.member.provider";
import React, { PropsWithChildren } from "react";

const WorkspaceLayout = async ({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ id: string }> }>) => {
  const { id } = await params;
  return (
    <WorkspaceMemberProvider workspaceId={id}>
      {children}
    </WorkspaceMemberProvider>
  );
};

export default WorkspaceLayout;
