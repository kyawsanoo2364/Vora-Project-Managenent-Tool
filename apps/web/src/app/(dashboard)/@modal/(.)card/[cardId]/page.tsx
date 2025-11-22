import React from "react";
import Modal from "../../../../../components/modal";
import EditCardView from "@/components/views/editCardView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card | Vora",
  description: "",
};

const CardPage = () => {
  return (
    <Modal>
      <EditCardView />
    </Modal>
  );
};

export default CardPage;
