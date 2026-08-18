import { useRouter } from "next/navigation";
import AlertModal from "@/components/modal/alert-modal";
import { useDeletePost } from "@/hooks/mutations/post/use-delete-post";
import { showErrorToast } from "@/lib/error";
import { useModal } from "@/stores/modal";

export default function DeletePostConfirmModal({
  postId,
  userId,
  type,
}: {
  postId: number;
  userId: string;
  type?: "FEED" | "DETAIL";
}) {
  const { close } = useModal();
  const router = useRouter();
  const { mutate: deletePost, isPending: isDeletePending } = useDeletePost({
    onSuccess: () => {
      if (type === "DETAIL") router.push("/");
    },
    onError: (error) => showErrorToast(error, "포스트 삭제에 실패했습니다"),
  });

  const handleConfirm = () => {
    deletePost({ id: postId, userId });
    close();
  };

  return (
    <AlertModal
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
      title="게시글을 삭제할까요?"
      description="삭제한 게시글은 다시 되돌릴 수 없어요."
      confirmText="삭제"
      onConfirm={handleConfirm}
    />
  );
}
