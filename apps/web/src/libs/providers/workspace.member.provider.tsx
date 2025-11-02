"use client";

import React, { createContext, PropsWithChildren, useContext } from "react";
import { WorkspaceMemberType } from "../types";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { GET_WORKSPACE_MEMBER } from "../utils/queryStringGraphql";
import ErrorComponent from "../../components/error-component";

type WorkspaceMemberContextType = {
  isLoading: boolean;
  member: WorkspaceMemberType | null;
};

const workspaceMemberContext = createContext<WorkspaceMemberContextType>({
  isLoading: false,
  member: null,
});

const WorkspaceMemberProvider = ({
  workspaceId,
  children,
}: PropsWithChildren<{ workspaceId: string }>) => {
  const member = useQuery({
    queryKey: ["workspace_member", workspaceId],
    queryFn: async () =>
      (await fetchWithAuth(GET_WORKSPACE_MEMBER, { workspaceId }))?.getMember,
  });

  if (!member.isLoading && member.isError) {
    return <ErrorComponent title={member.error.message} />;
  }

  return (
    <workspaceMemberContext.Provider
      value={{ member: member.data, isLoading: member.isLoading }}
    >
      {children}
    </workspaceMemberContext.Provider>
  );
};

export default WorkspaceMemberProvider;

export const useWorkspaceMember = () => {
  const context = useContext(workspaceMemberContext);
  if (!context) throw new Error("Workspace member provider required!");
  return context;
};
