"use client";

import { Button } from "@/components/modern-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/modern-ui/popover";
import { Textarea } from "@/components/modern-ui/textarea";
import React, { useState } from "react";

const EditCardPopover = ({
  trigger,
  id,
  title,
}: {
  trigger: React.ReactNode;
  id: string;
  title: string;
}) => {
  const [newTitle, setNewTitle] = useState(title);
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent side="left">
        <form>
          <Textarea
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Button className="mt-3">Change</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default EditCardPopover;
