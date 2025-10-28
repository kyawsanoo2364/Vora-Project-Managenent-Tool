"use client";

import { useEffect, useState } from "react";

export const useMount = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  return isMounted;
};
