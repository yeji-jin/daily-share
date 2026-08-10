"use client";

import { ComponentType, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PostEditorModal from "@/components/modal/post-editor-modal";
import DeletePostConfirmModal from "@/components/modal/delete-post-confirm-modal";
import { ModalType, useModal } from "@/stores/modal";

/**
 * 모달 레지스트리: "모달 키" -> "렌더링할 컴포넌트"
 * 새 모달을 추가할 때 이 객체에 한 줄만 추가하면 된다. (아래 렌더링 로직은 수정할 필요 없음)
 * 예: confirmDelete: ConfirmDeleteModal,
 */
const MODAL_COMPONENTS: Record<ModalType, ComponentType<any>> = {
  postEditor: PostEditorModal,
  deletePostConfirm: DeletePostConfirmModal,
};

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [modalRoot, setModalRoot] = useState<Element | null>(null);
  const { type, props } = useModal();

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  const ActiveModal = type ? MODAL_COMPONENTS[type] : null;

  return (
    <>
      {children}
      {modalRoot &&
        ActiveModal &&
        createPortal(<ActiveModal {...props} />, modalRoot)}
    </>
  );
}
