"use client";

import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  ASSIGN_MEMBER_TO_CARD,
  GET_ALL_BOARD_MEMBERS,
  REMOVE_ASSIGNED_MEMBER_FROM_CARD,
} from "@/libs/utils/queryStringGraphql";
import { AssignMember, BoardMemberType } from "@/libs/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn, initialAvatarText } from "@/libs/utils/helpers";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";

interface MemberContentProps {
  boardId: string;
  assignedMembers: AssignMember[];
  cardId: string;
}

const MemberContent = ({
  boardId,
  assignedMembers,
  cardId,
}: MemberContentProps) => {
  const queryClient = useQueryClient();
  const [toastId, setToastId] = useState("");
  const getAllBoardMember = useQuery({
    queryKey: ["card_board_member", boardId],
    queryFn: async () =>
      (await fetchWithAuth(GET_ALL_BOARD_MEMBERS, { boardId }))
        ?.boardMembers as BoardMemberType[],
    staleTime: 1000 * 60 * 2, // 2 mins steal data
  });

  const addAssignMember = useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      await fetchWithAuth(ASSIGN_MEMBER_TO_CARD, {
        boardId,
        cardId,
        memberId: id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
      toast.dismiss(toastId);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!", { id: toastId });
    },
  });

  const removeAssignMember = useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      await fetchWithAuth(REMOVE_ASSIGNED_MEMBER_FROM_CARD, {
        boardId,
        cardId,
        memberId: id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
      toast.dismiss(toastId);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!", { id: toastId });
    },
  });

  const toggleAssignAndRemoveMember = (id: string) => {
    const isAssigned = Boolean(assignedMembers.find((m) => m.id === id));
    setToastId(toast.loading("Processing..."));
    if (isAssigned) {
      removeAssignMember.mutate({ id });
    } else {
      addAssignMember.mutate({ id });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-medium text-center">Members</h3>
      <div className="flex flex-col gap-2">
        <Command className="w-full">
          <CommandInput placeholder="search member..." />
          {assignedMembers?.length > 0 && (
            <>
              <h4 className="text-sm font-medium my-2">Card Members</h4>
              <CommandList className="max-h-[100px]">
                <CommandGroup>
                  {assignedMembers?.map((member, i) => (
                    <CommandItem key={i} className={cn("cursor-pointer")}>
                      <div className="flex w-full flex-row gap-4 items-center justify-between">
                        <div className="flex row gap-4 items-center">
                          <Avatar>
                            <AvatarImage
                              src={member.user.avatar}
                              alt={member.user.firstName}
                            />
                            <AvatarFallback className="bg-blue-500">
                              {initialAvatarText(
                                `${member.user.firstName} ${member.user.lastName}`,
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="text-base font-medium">
                            {`${member.user.firstName} ${member.user.lastName}`}
                          </h3>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <Button
                            variant={"ghost"}
                            onClick={() =>
                              toggleAssignAndRemoveMember(member.id)
                            }
                          >
                            <XIcon />
                          </Button>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </>
          )}
          {getAllBoardMember.data && getAllBoardMember.data.length > 0 && (
            <>
              <h4 className="text-sm font-medium my-2">Board Members</h4>
              <CommandList className="max-h-[100px]">
                <CommandEmpty>
                  <span className="text-slate-500 font-medium">
                    No Result Found.
                  </span>
                </CommandEmpty>
                <CommandGroup>
                  {getAllBoardMember.data
                    ?.filter(
                      (m) =>
                        m.id !== assignedMembers.find((a) => a.id === m.id)?.id,
                    )
                    .map((member, i) => (
                      <CommandItem key={i} className={cn("cursor-pointer")}>
                        <div
                          className="flex flex-row gap-4 items-center"
                          onClick={() => toggleAssignAndRemoveMember(member.id)}
                        >
                          <Avatar>
                            <AvatarImage
                              src={member.user.avatar}
                              alt={member.user.fullName}
                            />
                            <AvatarFallback className="bg-blue-500">
                              {initialAvatarText(member.user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="text-base font-medium">
                            {member.user.fullName}
                          </h3>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </>
          )}
        </Command>
      </div>
    </div>
  );
};

export default MemberContent;
