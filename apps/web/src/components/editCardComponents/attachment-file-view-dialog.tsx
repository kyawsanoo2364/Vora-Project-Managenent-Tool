"use client";

import { AttachmentFileType } from "@/libs/types";
import React, { Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  ArrowUpRightIcon,
  DownloadIcon,
  FileXIcon,
  LaptopMinimalIcon,
  XIcon,
} from "lucide-react";
import { formatDate } from "date-fns";

interface Props {
  data: AttachmentFileType;
  trigger: React.ReactNode;
}

const AttachmentFileViewDialog = ({ trigger, data }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogOverlay className="bg-gray-800/80">
        <DialogContent
          showCloseButton={false}
          className="shadow-none border-none bg-transparent "
        >
          <DialogTitle></DialogTitle>
          {!data.media.type.includes("image") ? (
            <div className="flex items-center justify-center flex-col gap-2 text-slate-400 font-medium">
              <FileXIcon className="size-8" />
              <h4>Unable to read this file. Please download and check.</h4>
            </div>
          ) : (
            <img
              src={data.media.url}
              alt={data.media.filename}
              className="w-[500px] h-[400px] object-contain rounded-md"
            />
          )}

          <div className="flex flex-col gap-2">
            <h3 className=" font-bold text-white text-xl w-full text-center ">
              {data.media.filename}.{data.media.type.split("/")[1]}
            </h3>
            <p className="text-lg font-medium text-center">
              Added{" "}
              {formatDate(
                new Date(parseInt(data.createdAt)),
                "dd MMMM yyyy hh:mm a",
              )}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-4 justify-center">
            <Button
              asChild
              className="hover:bg-gray-500/10 bg-transparent text-white"
            >
              <a href={data.media.url} download target="_blank">
                <DownloadIcon />
                Download
              </a>
            </Button>
            <Button
              asChild
              className="hover:bg-gray-500/10 bg-transparent text-white"
            >
              <a
                href={data.media.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowUpRightIcon />
                Open In New Tab
              </a>
            </Button>
            {data.media.type.includes("image") && (
              <Button className="hover:bg-gray-500/10 bg-transparent text-white">
                <LaptopMinimalIcon />
                Make as cover
              </Button>
            )}
            <Button className="hover:bg-gray-500/10 bg-transparent text-white">
              <XIcon />
              Delete
            </Button>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default AttachmentFileViewDialog;
