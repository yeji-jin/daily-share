"use client";

import { useModal } from "@/stores/modal";
import { PlusCircleIcon } from "lucide-react";
import dynamic from "next/dynamic";

const PostEditorModal = dynamic(() => import("@/components/modal/post-editor-modal"));

export default function CreatePostButton() {
  const { open } = useModal();
  return (
    <div
      className="bg-muted text-muted-foreground flex w-full cursor-pointer items-center justify-between rounded-xl px-6 py-4"
      onClick={() => open(PostEditorModal, { mode: "create" })}
    >
      <p>나누고 싶은 이야기가 있나요?</p>
      <PlusCircleIcon className="size-5" />
    </div>
  );
}
