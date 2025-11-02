"use client";

import React from "react";
import { Input } from "../modern-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../modern-ui/button";

const ChecklistContent = () => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="w-full text-center text-sm">Add Checklist</h3>
      <form className="flex flex-col gap-4">
        <Input placeholder="Checkbox title..." />
        <Select defaultValue="none">
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">(none)</SelectItem>
          </SelectContent>
        </Select>
        <Button className="max-w-[80px]">Add</Button>
      </form>
    </div>
  );
};

export default ChecklistContent;
