import { redirect } from "next/navigation";

export const universalRedirect = (path: string) => {
  if (typeof window !== "undefined") {
    window.location.href = path;
    return;
  } else {
    redirect(path);
  }
};
