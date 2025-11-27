"use client";

import React from "react";
import { Label } from "../modern-ui/label";
import { Button } from "../ui/button";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

const CoverCardContent = () => {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-lg font-semibold text-center">Cover</h4>
      <div className="flex flex-col gap-1">
        <Label>Size</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="w-full h-24 rounded-md">
            <Image
              src={"/example1.jpeg"}
              alt="eg1"
              width={80}
              height={80}
              className="w-full h-[30px] object-contain"
            ></Image>
            <div className="flex flex-col gap-2 p-2">
              <div className="w-full h-1 rounded-full bg-gray-500"></div>
              <div className="w-[40px] h-1 rounded-full bg-gray-500"></div>
              <div className="w-[60px] h-1 rounded-full bg-gray-500"></div>
              <div className="w-[30px] h-1 rounded-full bg-gray-500"></div>
            </div>
          </div>
          <div
            className="w-full h-24 bg-blue-500 rounded-md "
            style={{ background: `url("/example1.jpeg")`, objectFit: "cover" }}
          >
            <div className="h-[40px] w-full" />
            <div className="flex flex-col gap-2 p-2 pb-5 bg-gray-50/30 backdrop-blur-lg">
              <div className="w-full h-1 rounded-full bg-gray-400"></div>
              <div className="w-[40px] h-1 rounded-full bg-gray-400"></div>
              <div className="w-[60px] h-1 rounded-full bg-gray-400"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-2 flex flex-col gap-1">
        <Label>Attachments</Label>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="w-full h-10 relative rounded-md" key={i}>
              <Image
                fill
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ56GHU4VQhF7NpfhEc_wdvuZd5qduyOb9mIQ&s"
                }
                className="object-contain"
                alt="waww"
              />
            </div>
          ))}
        </div>
      </div>
      <Button variant={"outline"}>Remove Cover</Button>
    </div>
  );
};

export default CoverCardContent;
