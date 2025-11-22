import EditCardView from "@/components/views/editCardView";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Card | Vora",
  description: "",
};

const page = () => {
  return <EditCardView />;
};

export default page;
