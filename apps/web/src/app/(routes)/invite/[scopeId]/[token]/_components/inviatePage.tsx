"use client";

import { useLocalStorage } from "@/hooks/use-localstorage";
import { useAuth } from "@/libs/providers/auth.provider";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  ACCEPT_INVITE_LINK,
  CONFIRM_INVITE_LINK,
} from "@/libs/utils/queryStringGraphql";
import { Spinner } from "@radix-ui/themes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const InvitePage = ({ scopeId, token }: { scopeId: string; token: string }) => {
  const router = useRouter();

  const [workspaceId, setWorkspaceId] = useLocalStorage<string | null>(
    "vora_workspace_id",
    null,
  );
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["confirm_invite_link", scopeId, token],
    queryFn: async () =>
      (await fetchWithAuth(CONFIRM_INVITE_LINK, { scopeId, token }))
        ?.confirmLink,
  });

  const acceptMutation = useMutation({
    mutationFn: async (token: string) =>
      await fetchWithAuth(ACCEPT_INVITE_LINK, { token }),
    onSuccess: () => {
      if ((data.scopeType as string).toLowerCase() === "workspace") {
        setWorkspaceId(scopeId);
        router.push(`/home/workspace/${scopeId}/boards`);
      } else if (data.scopeType.toLowerCase() === "board") {
        router.push(`/b/${scopeId}`);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  useEffect(() => {
    if (!isLoading && data?.alreadyJoined && !isError) {
      if ((data.scopeType as string).toLowerCase() === "workspace") {
        setWorkspaceId(scopeId);
        router.push(`/home/workspace/${scopeId}/boards`);
      } else if (data.scopeType.toLowerCase() === "board") {
        router.push(`/b/${scopeId}`);
      }
    }
  }, [isLoading, data?.alreadyJoined, data?.scopeType, isError]);

  return (
    <div className="w-screen h-screen bg-slate-100 text-black flex items-center justify-center p-2">
      <div className="max-w-lg w-full bg-white rounded-md p-2 shadow-sm pb-6">
        {isLoading || data?.alreadyJoined ? (
          <div className="flex items-center justify-center w-full h-32">
            <Spinner size={"3"} />
          </div>
        ) : !isError && !data?.alreadyJoined ? (
          <>
            <div className="flex w-full items-center justify-center mt-2">
              <Image src={"/logo2.png"} alt="Logo" width={100} height={100} />
            </div>
            <h3 className="text-base text-slate-800 text-center">
              <strong>{data.invitedBy}</strong> invited you to join this{" "}
              <strong>
                {data.scopeName}{" "}
                {data.scopeType.toLowerCase() === "workspace"
                  ? "Workspace"
                  : "Board"}
              </strong>
              !
            </h3>
            <div className="flex items-center gap-4 mt-6 justify-center">
              {/* <button className="p-2 border text-sm hover:bg-gray-500/10  rounded-md border-gray-400 text-slate-600 cursor-pointer">
                Decline
              </button> */}
              <button
                className="px-4 py-2 rounded-md bg-blue-500 text-white text-sm cursor-pointer hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => acceptMutation.mutate(token)}
                disabled={acceptMutation.isPending}
              >
                {acceptMutation.isPending ? "Please wait..." : "Accept"}
              </button>
            </div>
          </>
        ) : isError ? (
          <div className="p-2 flex flex-col items-center justify-center gap-2">
            <XCircle className="size-8 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-600">
              {error.message}
            </h2>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InvitePage;
