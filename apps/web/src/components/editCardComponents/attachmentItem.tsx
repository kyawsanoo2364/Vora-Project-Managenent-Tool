"use client";

import {
  DockIcon,
  DownloadIcon,
  EditIcon,
  EllipsisIcon,
  FileIcon,
  TrashIcon,
} from "lucide-react";
import React, { FormEvent, Suspense, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { AttachmentFileType } from "@/libs/types";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";

import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  ADD_COVER_IN_CARD,
  REMOVE_ATTACHMENT,
  REMOVE_COVER_FROM_CARD,
  UPDATE_ATTACHMENT_IN_CARD,
} from "@/libs/utils/queryStringGraphql";
import toast from "react-hot-toast";
import AttachmentFileViewDialog from "./attachment-file-view-dialog";

interface Props {
  data: AttachmentFileType;
  boardId: string;
  cardId: string;
  coverId?: string;
}

const AttachmentItem = ({ data, boardId, cardId, coverId }: Props) => {
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [fileName, setFileName] = useState(data.media.filename);
  const [toastId, setToastId] = useState("");

  const removeAttachment = useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      await fetchWithAuth(REMOVE_ATTACHMENT, { id, boardId }),
    onError: (err) => {
      toast.error(err.message || "Something went wrong!", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
      toast.success("Attachment file removed!", { id: toastId });
    },
  });

  const updateAttachment = useMutation({
    mutationFn: async ({ filename }: { filename: string }) =>
      await fetchWithAuth(UPDATE_ATTACHMENT_IN_CARD, {
        id: data.id,
        boardId,
        filename,
      }),
    onSuccess: () => {
      setIsEdit(false);
      toast.success("Attachment updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!", { id: toastId });
    },
  });

  const onUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (fileName.trim().length === 0) return;
    if (fileName === data.media.filename) return;
    setToastId(toast.loading("Updating attachment..."));
    updateAttachment.mutate({ filename: fileName });
  };

  const addCoverMutation = useMutation({
    mutationFn: async ({ attachmentId }: { attachmentId: string }) =>
      await fetchWithAuth(ADD_COVER_IN_CARD, { cardId, boardId, attachmentId }),
    onError: (err) => {
      toast.error(err.message || "Something went wrong!", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
      toast.success("Successfully added cover.", { id: toastId });
    },
  });

  const removeCoverMutation = useMutation({
    mutationFn: async () =>
      await fetchWithAuth(REMOVE_COVER_FROM_CARD, { cardId, boardId }),
    onError: (err) => {
      toast.error(err.message || "Something went wrong!", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["activities", cardId] });
      toast.success("Successfully removed cover", { id: toastId });
    },
  });

  return (
    <div className="flex items-center justify-between w-full">
      <AttachmentFileViewDialog
        trigger={
          <div className="flex items-center gap-2 cursor-pointer">
            <Suspense fallback={<FileIcon />}>
              <img
                src={data.media.url}
                alt={data.media.filename}
                className="size-8 object-contain"
              />
            </Suspense>

            <div className="flex flex-col ">
              <h4 className="max-w-[400px] truncate text-sm">
                {data.media.filename}
                {data.media.type !== "unknown"
                  ? `.${data.media.type.split("/")[1]}`
                  : ""}
              </h4>
              <span className="text-[12px] text-gray-400">
                {formatDistanceToNow(new Date(parseInt(data.createdAt)))}
              </span>
            </div>
          </div>
        }
        data={data}
      />
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon-sm"} variant={"ghost"}>
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setIsEdit(true)}>
              <EditIcon /> Edit
            </DropdownMenuItem>
            {data.media.type.includes("image") &&
              (coverId && coverId === data.id ? (
                <DropdownMenuItem
                  onSelect={() => {
                    setToastId(toast.loading("Processing..."));
                    removeCoverMutation.mutate();
                  }}
                >
                  <DockIcon /> Remove as cover
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onSelect={() => {
                    setToastId(toast.loading("Processing..."));
                    addCoverMutation.mutate({ attachmentId: data.id });
                  }}
                >
                  <DockIcon /> Make as cover
                </DropdownMenuItem>
              ))}

            <DropdownMenuItem>
              <a
                href={data.media.url}
                download
                target="_blank"
                className="flex items-center gap-2"
              >
                <DownloadIcon /> Download
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onSelect={() => {
                setToastId(toast.loading("Removing..."));
                removeAttachment.mutate({ id: data.id });
              }}
              disabled={removeAttachment.isPending}
            >
              <TrashIcon className="text-red-500" />
              {removeAttachment.isPending ? "Removing..." : "Remove"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={isEdit} onOpenChange={() => setIsEdit(!isEdit)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>Edit</DialogHeader>
          <form className="mt-2" onSubmit={onUpdate}>
            <Input
              placeholder="File Name..."
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <div className="mt-2 flex items-center gap-3">
              <Button type="submit" disabled={updateAttachment.isPending}>
                {updateAttachment.isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttachmentItem;
