import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { useModal } from "@/stores/modal";
import { useEffect, useRef, useState } from "react";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { showErrorToast } from "@/lib/error";

export default function PostEditorModal() {
  const { close } = useModal();
  const [content, setContent] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      close();
    },
    onError: (error) => showErrorToast(error, "포스트 생성에 실패했습니다"),
  });
  const handleCreatePost = () => {
    if (content.trim() === "") return;
    createPost(content);
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      {/* Dialog가 닫히려고 할 때(close 이벤트가 발생했을 때) Zustand의 close()도 호출 */}
      <DialogContent className="max-h-[80vh]">
        <DialogTitle>포스트 작성</DialogTitle>
        <textarea
          ref={textAreaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="max-h-125 min-h-24 rounded-md border p-4 focus:outline-none"
          placeholder="어떤일을 기록할까요?"
        />
        <div className="flex flex-col gap-2">
          <Button variant={"outline"} className="cursor-pointer">
            이미지 추가
            <ImageIcon size={20} />
          </Button>
          <Button
            className="cursor-pointer"
            disabled={isCreatePostPending}
            onClick={handleCreatePost}
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
