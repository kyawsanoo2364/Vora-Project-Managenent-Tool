"use client";

import React, { useEffect, useRef, useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../modern-ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { ADD_ATTACHMENT_FILE_USING_URL_TO_CARD } from "@/libs/utils/queryStringGraphql";
import toast from "react-hot-toast";

const AttachmentContent = ({
  cardId,
  boardId,
}: {
  cardId: string;
  boardId: string;
}) => {
  const queryClient = useQueryClient();
  const [toastId, setToastId] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const addAttachmentWithUrl = useMutation({
    mutationFn: async ({ url }: { url: string }) =>
      await fetchWithAuth(ADD_ATTACHMENT_FILE_USING_URL_TO_CARD, {
        url,
        cardId,
        boardId,
      }),
    onSuccess: () => {
      toast.success("Uploaded file successfully.", { id: toastId as string });
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
      setUrl("");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!", {
        id: toastId as string,
      });
    },
  });

  const addAttachmentFile = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      return await fetchWithAuth(
        null,
        undefined,
        {
          method: "POST",
          body: formData,
        },
        undefined,
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/boards/${boardId}/cards/${cardId}/attachment/upload`,
      );
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!", {
        id: toastId as string,
      });
    },
    onSuccess: (data) => {
      if (data?.statusCode > 200) {
        toast.error(data?.error || "Something went wrong!", {
          id: toastId as string,
        });
        return;
      }
      toast.success("Uploaded file successfully.", { id: toastId as string });
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
    },
  });

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      setToastId(toast.loading("Uploading..."));

      addAttachmentFile.mutate({ file });
    }
  }, [file]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-medium">Attach</h3>
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold">
          Attach a file from your computer
        </h4>
        <p className="text-[12px] text-slate-500">
          Drag and drop your file here, or click to browse.
        </p>

        <input
          hidden
          type="file"
          ref={fileRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setFile(file);
          }}
        />
        <Button className="w-full" onClick={() => fileRef?.current?.click()}>
          Upload a file
        </Button>
        <form
          className="space-y-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!url || url.length === 0) return;
            setToastId(toast.loading("uploading..."));
            await addAttachmentWithUrl.mutateAsync({ url });
          }}
        >
          <Label className="flex flex-col gap-2">
            <div className="flex flex-row">
              <span className="text-sm">Paste a Link</span>
              <span className="text-red-500">*</span>
            </div>
            <Input
              placeholder="Paste a link for attachment file"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Label>

          <Button
            disabled={addAttachmentWithUrl.isPending || url.length === 0}
            type="submit"
          >
            {addAttachmentWithUrl.isPending ? "Inserting..." : "Insert"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AttachmentContent;
