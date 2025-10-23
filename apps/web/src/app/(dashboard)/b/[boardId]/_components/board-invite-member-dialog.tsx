"use client";

import { Button } from "@/components/modern-ui/button";
import { Input } from "@/components/modern-ui/input";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { useAuth } from "@/libs/providers/auth.provider";
import { BoardMemberType, UserType } from "@/libs/types";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { initialAvatarText } from "@/libs/utils/helpers";
import { UPDATE_BOARD_MEMBER } from "@/libs/utils/queryStringGraphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PlusIcon, UserPlus2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";

const BoardInviteMemberDialog = ({
  members,
  boardId,
}: {
  members: BoardMemberType[];
  boardId: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const getUserRole = useCallback(() => {
    return members.find((u) => u.user.id === user?.id)?.role;
  }, [user, members]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} className="flex items-center gap-2">
          <UserPlus2 />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Board Member</DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex flex-row gap-2">
          <Input
            placeholder="Email address or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select defaultValue={"member"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            <PlusIcon />
            Invite
          </Button>
        </div>
        {searchTerm?.length > 0 && (
          <ScrollArea className="w-full h-32">
            <InviteMemberItem fullName="Ai Kayan" username="aikayan" />
          </ScrollArea>
        )}
        <Separator className="my-2" />
        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">Board Members</TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <ScrollArea className="w-full h-40 rounded-md ">
              {members?.map((m, i) => (
                <BoardMemberItem
                  fullName={m.user.fullName}
                  username={m.user.username}
                  key={i}
                  role={m.role}
                  id={m.id}
                  avatar={m.user.avatar}
                  boardId={boardId}
                  userId={m.user.id}
                  user={user}
                  getUserRole={getUserRole}
                />
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const InviteMemberItem = ({
  fullName,
  avatar,
  username,
}: {
  fullName: string;
  avatar?: string;
  username: string;
}) => {
  return (
    <div className="flex flex-row gap-2 items-center w-full hover:bg-gray-100/10 p-2 rounded-md cursor-pointer">
      <Avatar>
        <AvatarImage src={avatar} alt={fullName} />
        <AvatarFallback>{initialAvatarText(fullName)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h2 className="text-sm">{fullName}</h2>
        <p className="text-[12px]">@{username}</p>
      </div>
    </div>
  );
};

const BoardMemberItem = ({
  fullName,
  avatar,
  username,
  role,
  id,
  boardId,
  userId,
  user,
  getUserRole,
}: {
  fullName: string;
  avatar?: string;
  username: string;
  role: string;
  id: string;
  boardId: string;
  userId: string;
  user: UserType | null;
  getUserRole: () => string | undefined;
}) => {
  const queryClient = useQueryClient();
  const [roleValue, setRoleValue] = useState(role);
  const userRole = getUserRole();

  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) =>
      await fetchWithAuth(UPDATE_BOARD_MEMBER, { id, role, boardId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  const onRoleValueChange = async (value: string) => {
    setRoleValue(value);
    updateMemberMutation.mutate({ id, role: value });
  };

  return (
    <div className="flex flex-row items-center justify-between my-2">
      <div className="flex flex-row gap-2 items-center">
        <Avatar>
          <AvatarImage src={avatar} alt={fullName} />
          <AvatarFallback>{initialAvatarText(fullName)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="text-sm">{fullName}</h2>
          <p className="text-[12px]">@{username}</p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Select value={roleValue} onValueChange={onRoleValueChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {/* Admin role option - only ADMIN can assign, and cannot change admins unless you're admin */}
            <SelectItem
              disabled={
                userRole !== "ADMIN" || // Only admin can change to ADMIN
                userId === user?.id // Cannot change own role
              }
              value="ADMIN"
            >
              Admin
            </SelectItem>

            {/* Member role option */}
            <SelectItem
              disabled={
                userRole === "VIEWER" || // Viewer no permission
                userId === user?.id || // Cannot change own role
                (userRole === "MEMBER" &&
                  (role === "ADMIN" || role === "MEMBER")) // Member cannot modify an Admin
              }
              value="MEMBER"
            >
              Member
            </SelectItem>

            {/* Viewer role option */}
            <SelectItem
              disabled={
                userRole === "VIEWER" || // Viewer no permission
                userId === user?.id || // Cannot change their own role
                (userRole === "MEMBER" &&
                  (role === "ADMIN" || role === "MEMBER")) // Member cannot modify Admin
              }
              value="VIEWER"
            >
              Viewer
            </SelectItem>

            {/* Remove button */}
            {userRole === "ADMIN" && userId !== user?.id && (
              <Button
                variant="ghost"
                className="w-full items-start justify-start pl-2 text-red-500"
              >
                Remove from board
              </Button>
            )}

            {/* Leave board button for self */}
            {userId === user?.id && (
              <Button
                variant="ghost"
                className="w-full items-start justify-start pl-2 text-red-500"
              >
                Leave this board
              </Button>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BoardInviteMemberDialog;
