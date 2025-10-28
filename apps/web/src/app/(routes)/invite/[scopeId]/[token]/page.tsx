import { Metadata } from "next";
import React from "react";
import InvitePage from "./_components/inviatePage";
import { getCurrentUser } from "@/libs/utils/getCurrentUser";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Vora | Invite Link",
};

const page = async ({
  params,
}: {
  params: Promise<{ scopeId: string; token: string }>;
}) => {
  const { scopeId, token } = await params;

  const user = await getCurrentUser();
  if (!user) {
    const inviteLink = `/invite/${scopeId}/${token}`;
    redirect(`/signin?callback=${encodeURIComponent(inviteLink)}`);
  }
  return <InvitePage scopeId={scopeId} token={token} />;
};

export default page;
