"use client";
import InitialAvatar from "@/libs/components/initial-avatar";
import { useAuth } from "@/libs/providers/auth.provider";

import Image from "next/image";

import React from "react";
import WorkspaceDropdownMenu from "./workspace-dorpdown-menu";
import { Skeleton } from "@radix-ui/themes";

import MobileMenuNavbar from "./mobile-menu-navbar";

const Navbar = () => {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex flex-row justify-between gap-4 px-2 py-2 w-full bg-gradient-to-r from-[#1A1A25] to-[#232334] border-b border-b-gray-600">
      <div className="flex flex-row gap-4 items-center">
        <div className="md:border-r md:border-r-gray-700 md:pr-10 md:mr-4">
          <Image
            src={"/logo2.png"}
            alt={"vora"}
            width={72}
            height={72}
            className="w-18 object-contain"
          />
        </div>

        <WorkspaceDropdownMenu />
      </div>
      {/** Desktop */}
      <div className="hidden md:flex flex-row items-center gap-2 cursor-pointer">
        {isLoading ? (
          <div className="flex items-center gap-3 flex-row">
            <Skeleton
              width={"32px"}
              height={"32px"}
              style={{ borderRadius: "100%" }}
            />
            <Skeleton width={"80px"} height={"20px"} className="rounded-md" />
          </div>
        ) : (
          user &&
          (user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username}
              width={64}
              height={64}
              className="rounded-full size-8"
            />
          ) : (
            <InitialAvatar name={user.fullName} />
          ))
        )}
        <p className="text-white font-semibold text-base">{user?.fullName}</p>
      </div>
      {/**Mobile  */}
      <div className="flex flex-row items-center gap-2 md:hidden">
        <div className="flex items-center">
          {isLoading ? (
            <div className="flex items-center gap-3 flex-row">
              <Skeleton
                width={"32px"}
                height={"32px"}
                style={{ borderRadius: "100%" }}
              />
            </div>
          ) : (
            user &&
            (user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                width={64}
                height={64}
                className="rounded-full size-8"
              />
            ) : (
              <InitialAvatar name={user.fullName} />
            ))
          )}
        </div>

        <MobileMenuNavbar />
      </div>
    </div>
  );
};

export default Navbar;
