"use client";

import { Button } from "@/components/modern-ui/button";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ErrorComponent = ({ title }: { title: string }) => {
  const router = useRouter();
  const [defaultWorkspaceId, setDefaultWorkspaceId] = useLocalStorage<
    string | null
  >("vora_workspace_id", null);

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-4">
      <div className="flex items-center gap-2">
        <XCircleIcon className="size-10 text-slate-500" />
        <h1 className="text-4xl font-semibold text-slate-500">Opps!...</h1>
      </div>
      <h2 className="text-2xl font-medium text-slate-500">{title}</h2>
      <Button
        className="bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => {
          if (defaultWorkspaceId) {
            localStorage.removeItem("vora_workspace_id");
          }
          router.push("/home");
        }}
      >
        Go back home
      </Button>
    </div>
  );
};

export default ErrorComponent;
