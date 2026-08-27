"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useModal } from "@/stores/modal";

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [modalRoot, setModalRoot] = useState<Element | null>(null);
  const { Component, props } = useModal();

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  return (
    <>
      {children}
      {modalRoot && Component && createPortal(<Component {...props} />, modalRoot)}
    </>
  );
}
