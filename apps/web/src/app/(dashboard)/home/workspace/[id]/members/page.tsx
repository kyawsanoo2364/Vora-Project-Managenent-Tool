"use client";

import { Input } from "@/components/modern-ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React from "react";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  CREATE_OR_GET_INVITE_LINK,
  GET_ALL_WORKSPACE_MEMBERS,
  GET_INVITE_USING_SCOPE_ID,
  REVOKE_INVITE_LINK,
} from "@/libs/utils/queryStringGraphql";
import toast from "react-hot-toast";
import WorkspaceMemberItem, {
  WorkspaceMemberItemSkeleton,
} from "./_components/workspace-member-item";
import { WorkspaceMemberType } from "@/libs/types";
import ErrorComponent from "@/libs/components/error-component";
import { useWorkspaceMember } from "@/libs/providers/workspace.member.provider";

const MembersPage = () => {
  const { id: workspaceId } = useParams();
  const queryClient = useQueryClient();
  const { isLoading: memberLoading, member } = useWorkspaceMember();

  const { data } = useQuery({
    queryKey: ["invite", workspaceId],
    queryFn: async () =>
      (await fetchWithAuth(GET_INVITE_USING_SCOPE_ID, { scopeId: workspaceId }))
        ?.getInvite,
  });

  const members = useQuery({
    queryKey: ["workspace_members", workspaceId],
    queryFn: async () =>
      (await fetchWithAuth(GET_ALL_WORKSPACE_MEMBERS, { workspaceId }))
        ?.getAllWorkspaceMember,
  });

  const revokeMutation = useMutation({
    mutationFn: async () =>
      await fetchWithAuth(REVOKE_INVITE_LINK, { scopeId: workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invite", workspaceId] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async () =>
      (
        await fetchWithAuth(CREATE_OR_GET_INVITE_LINK, {
          scope: "workspace",
          scopeId: workspaceId,
        })
      )?.createInviteLink,
    onSuccess: (data) => {
      navigator.clipboard.writeText(data.inviteLink);
      toast.success("copied invite link successfully!");
      queryClient.invalidateQueries({ queryKey: ["invite", workspaceId] });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h2 className="text-xl font-semibold">
        Workspace Members{" "}
        {!members.isLoading && !members.isError && `(${members.data.length})`}
      </h2>
      <p className="text-sm text-slate-300 mt-2">
        Workspace member can view and join all Workspace boards and create new
        boards in the Workspace.
      </p>
      <Separator className="my-2" />
      {!memberLoading && member?.role?.toLowerCase() === "admin" && (
        <>
          <div className="w-full">
            <h4 className="text-lg font-semibold">Invite Member</h4>
            <div className="grid grid-cols-6">
              <div className="col-span-4">
                <p className="mt-2 text-sm text-slate-300 text-pretty ">
                  Invite members to your workspace and build a shared place for
                  ideas, tasks, and progress. Whether you're working with a
                  small team or a growing organization, collaboration starts
                  with a simple invite.
                </p>
              </div>
              <div className="col-span-2 flex flex-row items-center gap-4 justify-end">
                {data?.id && (
                  <button
                    onClick={() => revokeMutation.mutate()}
                    className="text-sm underline cursor-pointer hover:text-blue-500"
                  >
                    Disable Link
                  </button>
                )}
                <button
                  disabled={inviteMutation.isPending}
                  onClick={() => inviteMutation.mutate()}
                  className="p-2 text-sm cursor-pointer hover:bg-gray-100/5  border rounded-md flex flex-row items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="size-4" /> Invite With Link
                </button>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
        </>
      )}
      <div className="flex flex-col w-full gap-4">
        <Input placeholder="Filter by name" className="w-72" />
        <ScrollArea className="w-full h-80 ">
          {(memberLoading || members.isLoading) && (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <WorkspaceMemberItemSkeleton key={`member_${i}`} />
              ))}
            </div>
          )}
          {member &&
            members?.data?.map((m: WorkspaceMemberType, i: number) => (
              <WorkspaceMemberItem
                key={i}
                id={m.id}
                fullName={m.user.fullName}
                username={m.user.username}
                avatar={m.user.avatar}
                role={m.role}
                disabledRoleChange={member.role !== "ADMIN"}
                workspaceId={workspaceId as string}
                disabledOwnAdminChange={
                  member.role === "ADMIN" && m.user.id === member.userId
                }
                isAdmin={member.role === "ADMIN"}
                isOwn={m.user.id === member.userId}
              />
            ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MembersPage;
