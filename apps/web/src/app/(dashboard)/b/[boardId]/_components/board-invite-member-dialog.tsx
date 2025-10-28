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
import { cn, initialAvatarText } from "@/libs/utils/helpers";
import {
  CREATE_BOARD_MEMBER,
  GET_USERS_BY_NAME_OR_EMAIL,
  INVITE_LINK_USING_MAIL,
  UPDATE_BOARD_MEMBER,
} from "@/libs/utils/queryStringGraphql";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PlusIcon, UserPlus2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import BoardMemberInviteLink from "./board-member-invite-link";
import { useDebounce } from "@/libs/hooks/useDebounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/modern-ui/popover";

const BoardInviteMemberDialog = ({
  members,
  boardId,
}: {
  members: BoardMemberType[];
  boardId: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchValueDebounced = useDebounce(searchTerm, 500);
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const getUserRole = useCallback(() => {
    return members.find((u) => u.user.id === user?.id)?.role;
  }, [user, members]);
  const [selectedRole, setSelectedRole] = useState("MEMBER");

  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["get_user_by_name_or_email", boardId, searchValueDebounced],
    queryFn: async () =>
      (
        await fetchWithAuth(GET_USERS_BY_NAME_OR_EMAIL, {
          searchTerms: searchValueDebounced,
        })
      )?.getUsersByNameOrEmail,
  });

  const inviteLinkToEmail = useMutation({
    mutationFn: async ({ to, role }: { to: string; role: string }) =>
      await fetchWithAuth(INVITE_LINK_USING_MAIL, {
        scope: "board",
        scopeId: boardId,
        role,
        email: to,
      }),
    onSuccess: () => {
      setSearchTerm("");
      setSelectedEmail(null);
      toast.success("Successfully! invitation link sent.");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const directInviteExistingUser = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) =>
      await fetchWithAuth(CREATE_BOARD_MEMBER, { userId, role, boardId }),
    onSuccess: () => {
      toast.success("Successfully! Invited board member.");
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
      setSearchTerm("");
      setSelectedUserId(null);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  useEffect(() => {
    if (searchValueDebounced.length === 0) {
      setSelectedUserId(null);
      setSelectedEmail(null);
    }
  }, [searchValueDebounced]);

  function isValidEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const onInviteClick = () => {
    if (selectedEmail) {
      inviteLinkToEmail.mutate({ to: selectedEmail, role: selectedRole });
    } else if (selectedUserId) {
      directInviteExistingUser.mutate({
        userId: selectedUserId,
        role: selectedRole,
      });
    }
  };

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

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="VIEWER">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Button
            disabled={
              directInviteExistingUser.isPending
                ? directInviteExistingUser.isPending
                : inviteLinkToEmail.isPending || selectedUserId
                  ? !selectedUserId
                  : !selectedEmail
            }
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={onInviteClick}
          >
            <PlusIcon />
            {inviteLinkToEmail.isPending || directInviteExistingUser.isPending
              ? "Inviting..."
              : "Invite"}
          </Button>
        </div>
        {searchValueDebounced?.length > 0 && (
          <ScrollArea className="w-full h-32">
            {!usersQuery.isLoading && usersQuery.data?.length === 0 ? (
              isValidEmail(searchValueDebounced) ? (
                <InviteMemberItem
                  fullName={searchValueDebounced}
                  username="user"
                  onClick={() => setSelectedEmail(searchValueDebounced)}
                  isSelected={searchValueDebounced === selectedEmail}
                />
              ) : (
                <div className="flex flex-col justify-center items-center w-full h-32">
                  <h3 className="text-base font-medium text-slate-500 text-center">
                    Looks like that person isn't a Vora member yet. Add their
                    email address and invite them.
                  </h3>
                </div>
              )
            ) : (
              usersQuery.data?.map((user: UserType, i: number) => (
                <InviteMemberItem
                  fullName={user.fullName}
                  username={user.username}
                  avatar={user.avatar}
                  key={i}
                  onClick={() => setSelectedUserId(user.id)}
                  isSelected={selectedUserId === user.id}
                />
              ))
            )}
          </ScrollArea>
        )}

        <BoardMemberInviteLink boardId={boardId} />
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
  onClick,
  isSelected,
}: {
  fullName: string;
  avatar?: string;
  username: string;
  onClick?: () => void;
  isSelected?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-2 items-center w-full hover:bg-gray-100/10 p-2 rounded-md cursor-pointer",
        isSelected && "bg-gray-100/10",
      )}
      onClick={onClick}
    >
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full items-start justify-start pl-2 text-red-500"
                  >
                    Remove from board
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <h1 className="text-base font-semibold">Remove From Board</h1>
                  <p className="text-slate-400 text-sm">
                    {fullName} will be removed from all cards on this board.
                  </p>
                  <Button variant={"destructive"} className="w-full mt-2 ">
                    Remove
                  </Button>
                </PopoverContent>
              </Popover>
            )}

            {/* Leave board button for self */}
            {userId === user?.id && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full items-start justify-start pl-2 text-red-500"
                  >
                    Leave this board
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <h1 className="text-base font-semibold">Leave this board</h1>
                  <p className="text-slate-400 text-sm">
                    This will remove you from all cards on this board.
                  </p>
                  <Button variant={"destructive"} className="w-full mt-2 ">
                    Leave from this board
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BoardInviteMemberDialog;
