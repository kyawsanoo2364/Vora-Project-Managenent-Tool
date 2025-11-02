"use client";

import React, { useRef } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../modern-ui/label";

const AttachmentContent = () => {
  const fileRef = useRef<HTMLInputElement>(null);
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

        <input hidden type="file" ref={fileRef} />
        <Button className="w-full" onClick={() => fileRef?.current?.click()}>
          Upload a file
        </Button>
        <form className="space-y-2">
          <Label className="flex flex-col gap-2">
            <div className="flex flex-row">
              <span className="text-sm">Paste a Link</span>
              <span className="text-red-500">*</span>
            </div>
            <Input placeholder="Paste a link for attachment file" />
          </Label>

          <Button>Insert</Button>
        </form>
      </div>
    </div>
  );
};

export default AttachmentContent;
