"use client";

import { Button } from "@/components/modern-ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/modern-ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { initialAvatarText } from "@/libs/utils/helpers";
import {
  REMOVE_WORKSPACE_MEMBER,
  UPDATE_WORKSPACE_MEMBER_ROLE,
} from "@/libs/utils/queryStringGraphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOutIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import RemoveLeaveWorkspaceMember from "./remove-leave-workspaceMember";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { Skeleton } from "@/components/ui/skeleton";

export const WorkspaceMemberItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Skeleton className="size-10 rounded-full bg-gray-500 " />
        <div className="flex flex-col gap-2">
          <Skeleton className="bg-gray-500 h-4 w-32" />
          <Skeleton className="bg-gray-500 h-3 w-24" />
        </div>
      </div>
      <Skeleton className="bg-gray-500 h-8 w-32" />
    </div>
  );
};

const WorkspaceMemberItem = ({
  id,
  fullName,
  username,
  avatar,
  role,
  disabledRoleChange,
  workspaceId,
  disabledOwnAdminChange,
  isOwn,
  isAdmin,
}: {
  id: string;
  fullName: string;
  username: string;
  avatar?: string;
  role: string;
  disabledRoleChange?: boolean;
  workspaceId: string;
  disabledOwnAdminChange?: boolean;
  isOwn?: boolean;
  isAdmin?: boolean;
}) => {
  const queryClient = useQueryClient();
  const [roleValue, setRoleValue] = useState(role);
  const [defaultWorkspaceId, setDefaultWorkspaceId] = useLocalStorage<
    string | null
  >("vora_workspace_id", null);
  const router = useRouter();

  const updateMemberRole = useMutation({
    mutationFn: async ({ role }: { role: string }) =>
      await fetchWithAuth(UPDATE_WORKSPACE_MEMBER_ROLE, {
        id,
        role,
        workspaceId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["workspace_members", workspaceId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["workspace_member", workspaceId],
      });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const removeMember = useMutation({
    mutationFn: async ({
      id,
      workspaceId,
    }: {
      id: string;
      workspaceId: string;
    }) =>
      (await fetchWithAuth(REMOVE_WORKSPACE_MEMBER, { id, workspaceId }))
        ?.removeWorkspaceMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace_members", workspaceId],
      });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success(data);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const onRoleChange = (value: string) => {
    setRoleValue(value);
    updateMemberRole.mutate({ role: value });
  };

  return (
    <div className="w-full p-2 flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2 items-center">
        <Avatar>
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback>{initialAvatarText(fullName)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col ">
          <h2 className="text-base font-medium">{fullName}</h2>
          <span className="text-sm text-gray-400">@{username}</span>
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        {disabledRoleChange ? (
          <h4 className="px-4 py-2 text-sm border border-gray-400 rounded-md">
            {role}
          </h4>
        ) : (
          <Select
            value={roleValue}
            onValueChange={onRoleChange}
            disabled={updateMemberRole.isPending}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>Admin</TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Can view, create and edit Workspace boards, and change
                        settings for the Workspace.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>
              <SelectItem disabled={disabledOwnAdminChange} value="MEMBER">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>Member</TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Can view, create and edit Workspace boards but not
                        change settings.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
        {(isOwn || isAdmin) && (
          <RemoveLeaveWorkspaceMember
            isOwn={isOwn}
            onClick={() => {
              removeMember.mutate({ id, workspaceId });
              if (isOwn) {
                setDefaultWorkspaceId(null);
                router.replace("/home");
              }
            }}
            isButtonLoading={removeMember.isPending}
          >
            <Button variant={"destructive"}>
              {isOwn ? (
                <>
                  <LogOutIcon />
                  Leave
                </>
              ) : (
                <>
                  <XIcon /> Remove{" "}
                </>
              )}
            </Button>
          </RemoveLeaveWorkspaceMember>
        )}
      </div>
    </div>
  );
};

export default WorkspaceMemberItem;
