"use client";

import React, { useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { useClickAway } from "@/hooks/use-click-away";

const CheckList = () => {
  const [isEditTitle, setIsEditTitle] = useState(false);
  const titleRef = useRef(null);

  useClickAway(titleRef, () => {
    setIsEditTitle(false);
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center" ref={titleRef}>
        <Checkbox />
        {isEditTitle ? (
          <Input placeholder="Enter checklist title..." />
        ) : (
          <h3
            className="text-lg font-medium"
            onClick={() => setIsEditTitle(true)}
          >
            Test Checklist Title
          </h3>
        )}
      </div>
    </div>
  );
};

export default CheckList;
