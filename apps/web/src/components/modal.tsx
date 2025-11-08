"use client";

import React, { PropsWithChildren } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "./ui/dialog";
import { useRouter } from "next/navigation";

const Modal = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  const onHandleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen open onOpenChange={onHandleOpenChange}>
      <DialogOverlay>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-5xl min-w-5xl">
          {children}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default Modal;
