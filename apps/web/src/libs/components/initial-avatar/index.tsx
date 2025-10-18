"use client";

import React from "react";

type Props = {
  className?: string;
  name: string;
};

const InitialAvatar = ({ className, name }: Props) => {
  const initials = name
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .join("");
  return (
    <div
      className={`size-6 md:size-8 rounded-full p-2 bg-purple-500 text-white justify-center flex flex-row items-center ${className}`}
    >
      <span className="font-semibold text-[10px]  md:text-base">
        {initials}
      </span>
    </div>
  );
};

export default InitialAvatar;
