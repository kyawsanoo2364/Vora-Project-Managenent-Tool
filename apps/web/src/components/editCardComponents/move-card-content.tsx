"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../modern-ui/button";

const MoveCardContent = () => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-center">Move Card</h2>
      <p className="text-sm text-slate-500">Select Destination</p>
      <div className="flex flex-col w-full">
        <span className="text-base">Board</span>
        <Select defaultValue="hello">
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hello">Hello</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-2 grid grid-cols-6 w-full gap-2">
        <div className="col-span-4 flex flex-col">
          <span className="text-base">List</span>
          <Select defaultValue="test">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="test">Test value</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 flex flex-col">
          <span className="text-base">Position</span>
          <Select defaultValue="1">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        disabled
        className="my-2 disabled:bg-gray-500 text-white bg-blue-500 hover:bg-blue-600"
      >
        Move
      </Button>
    </div>
  );
};

export default MoveCardContent;
