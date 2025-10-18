"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/modern-ui/popover";
import { cn } from "@/libs/utils/helpers";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  onClick?: (value: string) => void;
  selectedColor?: string;
};

const gradients = [
  // Soft & cool tones
  "bg-gradient-to-r from-indigo-100 to-indigo-200",
  "bg-gradient-to-r from-cyan-400 to-blue-500",
  "bg-gradient-to-r from-teal-300 to-emerald-500",
  "bg-gradient-to-r from-green-300 to-lime-500",
  "bg-gradient-to-r from-sky-400 to-indigo-500",
  // Vivid & dark tones
  "bg-gradient-to-r from-indigo-700 to-purple-800",
  "bg-gradient-to-r from-violet-500 to-fuchsia-600",
  "bg-gradient-to-r from-fuchsia-600 to-pink-500",
  "bg-gradient-to-r from-pink-600 to-rose-500",
  "bg-gradient-to-r from-rose-400 to-red-600",
  // Warm & sunset tones
  "bg-gradient-to-r from-amber-400 to-orange-500",
  "bg-gradient-to-r from-yellow-300 to-orange-400",
  "bg-gradient-to-r from-orange-400 to-red-500",
  // Premium / modern tones
  "bg-gradient-to-r from-slate-400 to-slate-700",
  "bg-gradient-to-r from-zinc-600 to-neutral-900",
  "bg-gradient-to-r from-gray-300 to-gray-600",
  "bg-gradient-to-r from-blue-900 to-indigo-900",
  "bg-gradient-to-r from-emerald-700 to-teal-900",

  "bg-gray-800",
];

const ColorPickButton = ({ onClick, selectedColor }: Props) => {
  const [customColor, setCustomColor] = useColor("");

  return (
    <div className="flex gap-2">
      {gradients.slice(0, 6).map((gradient, i) => (
        <div
          key={i}
          className={cn(
            `w-10 h-10 rounded-xl cursor-pointer transition-transform hover:scale-110 ${gradient}`,
            selectedColor === gradient && "ring-2 ring-blue-500 scale-105",
          )}
          onClick={() => onClick?.(gradient)}
        />
      ))}
      <Popover>
        <PopoverTrigger>
          <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-white text-lg font-bold">
            ...
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-wrap gap-2 ">
            {gradients.map((gradient, i) => (
              <div
                key={i}
                className={cn(
                  `w-10 h-10 rounded-xl cursor-pointer transition-transform hover:scale-110 ${gradient}`,
                  selectedColor === gradient &&
                    "ring-2 ring-blue-500 scale-105",
                )}
                onClick={() => onClick?.(gradient)}
              />
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <p className="size-10 rounded-xl cursor-pointer bg-gray-500/10 flex items-center justify-center hover:bg-gray-400/10">
                  <PlusIcon className="size-4" />
                </p>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-auto ">
                <ColorPicker
                  color={customColor}
                  onChange={(color) => {
                    setCustomColor(color);
                    onClick?.(color.hex);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPickButton;
