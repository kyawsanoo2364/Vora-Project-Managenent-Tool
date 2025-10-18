"use client";

export const getDefaultWorkspaceId = () => {
  return localStorage.getItem("vora_workspace_id");
};

export const setDefaultWorkspaceId = (id: string) => {
  return localStorage.setItem("vora_workspace_id", id);
};
