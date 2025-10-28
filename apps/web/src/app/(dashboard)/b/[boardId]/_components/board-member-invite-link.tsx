"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  CREATE_OR_GET_INVITE_LINK,
  GET_INVITE_USING_SCOPE_ID,
  REVOKE_INVITE_LINK,
} from "@/libs/utils/queryStringGraphql";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link2Icon } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const BoardMemberInviteLink = ({ boardId }: { boardId: string }) => {
  const queryClient = useQueryClient();
  const [role, setRole] = useState("MEMBER");

  const { data } = useQuery({
    queryKey: ["invite", boardId],
    queryFn: async () =>
      (await fetchWithAuth(GET_INVITE_USING_SCOPE_ID, { scopeId: boardId }))
        ?.getInvite,
  });

  const revokeMutation = useMutation({
    mutationFn: async () =>
      await fetchWithAuth(REVOKE_INVITE_LINK, { scopeId: boardId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invite", boardId] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async () =>
      (
        await fetchWithAuth(CREATE_OR_GET_INVITE_LINK, {
          scope: "board",
          scopeId: boardId,
          role,
        })
      )?.createInviteLink,
    onSuccess: (data) => {
      navigator.clipboard.writeText(data.inviteLink);
      toast.success("copied invite link successfully!");
      queryClient.invalidateQueries({ queryKey: ["invite", boardId] });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
  return (
    <div className="mt-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-gray-500/20 rounded-full px-2 py-1">
          <Link2Icon className="size-4" />
        </div>
        <div className="flex flex-col items-start">
          {data?.id ? (
            <>
              <h5 className="text-sm">
                Anyone with the link can join as member.
              </h5>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => revokeMutation.mutate()}
                  className="text-blue-500 underline text-sm cursor-pointer"
                >
                  Remove Link
                </button>
                <span>.</span>
                <button
                  onClick={() => inviteMutation.mutate()}
                  className="text-blue-500 underline text-sm cursor-pointer"
                >
                  Copy Link
                </button>
              </div>
            </>
          ) : (
            <>
              <h5 className="text-sm">Share this board with link.</h5>
              <button
                className="text-blue-500 underline text-sm cursor-pointer"
                onClick={() => inviteMutation.mutate()}
              >
                Create Link
              </button>
            </>
          )}
        </div>
      </div>
      {!data?.id && (
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>Change Permission</SelectTrigger>
          <SelectContent>
            <SelectItem value="MEMBER">
              <div className="flex flex-col max-w-[250px]">
                <h1 className="font-semibold text-base">Member</h1>
                <p className="text-gray-500 text-sm">
                  Board Member can view and edit cards,lists and some board
                  settings.
                </p>
              </div>
            </SelectItem>
            <SelectItem value="VIEWER">
              <div className="flex flex-col max-w-[250px]">
                <h1 className="font-semibold text-base">Viewer</h1>
                <p className="text-gray-500 text-sm">
                  Board viewer can only view cards, lists and comments.
                </p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default BoardMemberInviteLink;
