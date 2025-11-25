"use client";

import ColorThief from "colorthief";
import { useEffect, useState } from "react";

const useImageColor = (url: string) => {
  const [color, setColor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    img.onload = () => {
      const thief = new ColorThief();
      const [r, g, b] = thief.getColor(img);
      setColor(`rgb(${r},${g},${b})`);
      setIsLoading(false);
    };
  }, [url]);

  return { color, isLoading };
};

export default useImageColor;
