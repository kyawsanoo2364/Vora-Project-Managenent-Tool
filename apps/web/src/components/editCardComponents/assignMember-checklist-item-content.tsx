"use client";

import React, { useState } from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GET_ALL_BOARD_MEMBERS } from "@/libs/utils/queryStringGraphql";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { AssignMember, BoardMemberType } from "@/libs/types";
import { cn, initialAvatarText } from "@/libs/utils/helpers";
import { CommandEmpty } from "cmdk";

const AssignMemberChecklistItemContent = ({
  boardId,
  selectedMembers,
  setSelectedMembers,
  onClickMember,
  onRemoveSelectedMember,
}: {
  boardId: string;
  selectedMembers: [] | AssignMember[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<[] | AssignMember[]>>;
  onClickMember?: (memberId: string) => void;
  onRemoveSelectedMember?: (memberId: string) => void;
}) => {
  const getAllBoardMember = useQuery({
    queryKey: ["card_board_member", boardId],
    queryFn: async () =>
      (await fetchWithAuth(GET_ALL_BOARD_MEMBERS, { boardId }))
        ?.boardMembers as BoardMemberType[],
    staleTime: 1000 * 60 * 2, // 2 mins steal data
  });

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-medium text-center">Members</h3>
      <div className="flex flex-col gap-2">
        <Command className="w-full">
          <CommandInput placeholder="search member..." />
          {selectedMembers && selectedMembers?.length > 0 && (
            <>
              <h4 className="text-sm font-medium my-2">Selected Members</h4>
              <CommandList className="max-h-[100px]">
                <CommandGroup>
                  {selectedMembers?.map((member, i) => (
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
                            onClick={() => {
                              setSelectedMembers((prev) =>
                                prev.filter((m) => m.id !== member.id),
                              );
                              onRemoveSelectedMember?.(member.id);
                            }}
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
                        m.id !==
                        selectedMembers?.find((a) => a.id === m.id)?.id,
                    )
                    .map((member, i) => (
                      <CommandItem key={i} className={cn("cursor-pointer")}>
                        <div
                          className="flex flex-row gap-4 items-center"
                          onClick={() => {
                            setSelectedMembers([...selectedMembers, member]);
                            onClickMember?.(member.id);
                          }}
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

export default AssignMemberChecklistItemContent;
