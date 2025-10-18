"use client";

import { MenuIcon } from "lucide-react";
import React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/modern-ui/sheet";
import { Button } from "@/components/modern-ui/button";

const MobileMenuNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenuNavbar;
