"use client";

import { useLocalStorage } from "@/hooks/use-localstorage";
import { useMount } from "@/hooks/use-mount";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  const [getDefaultWorkspaceId] = useLocalStorage<string | null>(
    "vora_workspace_id",
    null,
  );
  const isMounted = useMount();
  if (!isMounted) return null;

  return (
    <Link
      href={`/home/workspace/${getDefaultWorkspaceId}`}
      className="md:border-r md:border-r-gray-700 md:pr-10 md:mr-4"
    >
      <Image
        src={"/logo2.png"}
        alt={"vora"}
        width={72}
        height={72}
        className="w-18 object-contain"
      />
    </Link>
  );
};

export default Logo;
