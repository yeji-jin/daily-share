import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { PostEditorMode, useModal } from "@/stores/modal";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { showErrorToast } from "@/lib/error";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { useIsUserLoaded, useUser } from "@/stores/session";
import AlertModal from "@/components/modal/alert-modal";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { usePostData } from "@/hooks/queries/use-post-data";
import { useUpdatePost } from "@/hooks/mutations/post/use-update-post";

type ImageItem =
  { type: "existing"; url: string } | { type: "new"; file: File; previewUrl: string };

type EditorMode = {
  mode: PostEditorMode;
  postId?: number;
};

const getImageUrl = (image: ImageItem) =>
  image.type === "existing" ? image.url : image.previewUrl;

export default function PostEditorModal({ mode, postId }: EditorMode) {
  const user = useUser();
  const isUserLoaded = useIsUserLoaded();
  const { close } = useModal();
  const [content, setContent] = useState<string>("");
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageItemsRef = useRef(imageItems);
  imageItemsRef.current = imageItems;
  // 수정 모드 진입 시점의 기존 이미지 url 목록. 저장 시 이 목록과 비교해 삭제된 이미지를 찾아낸다.
  const originalImageUrlsRef = useRef<string[]>([]);

  const { data: post } = usePostData(postId);

  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      close();
    },
    onError: (error) => showErrorToast(error, "포스트 생성에 실패했습니다"),
  });

  const { mutate: updatePost, isPending: isUpdatePostPending } = useUpdatePost({
    onSuccess: () => {
      close();
    },
    onError: (error) => showErrorToast(error, "포스트 수정에 실패했습니다"),
  });

  const { isConfirmOpen, setIsConfirmOpen, requestClose, confirmDiscard } = useUnsavedChangesGuard({
    hasUnsavedChanges: content !== "" || imageItems.length !== 0,
    onDiscard: close,
  });

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      imageItemsRef.current.forEach((item) => {
        if (item.type === "new") URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  useEffect(() => {
    if (mode === "edit" && post) {
      setContent(post.content);
      const urls = post.image_urls ?? [];
      setImageItems(urls.map((url) => ({ type: "existing", url })));
      originalImageUrlsRef.current = urls;
    }
  }, [mode, post]);

  const handleSavePostClick = () => {
    if (content.trim() === "" || !isUserLoaded) return;

    const newImages = imageItems.filter((item) => item.type === "new").map((item) => item.file);

    if (mode === "create") {
      createPost({ content, images: newImages, userId: user!.id });
    } else {
      // 기존 이미지 중, 삭제되지 않고 아직 남아있는 것
      const keptImageUrls = imageItems
        .filter((item) => item.type === "existing")
        .map((item) => item.url);
      // 기존 이미지 중, 사용자가 지운 것
      const removedImageUrls = originalImageUrlsRef.current.filter(
        (url) => !keptImageUrls.includes(url),
      );

      updatePost({
        id: postId!,
        content,
        userId: user!.id,
        newImages,
        keptImageUrls,
        removedImageUrls,
      });
    }
  };

  const handleSelectImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        setImageItems((prev) => [
          ...prev,
          { type: "new", file, previewUrl: URL.createObjectURL(file) },
        ]);
      });
    }
    e.target.value = "";
  };

  const handleDeleteImage = (image: ImageItem) => {
    if (image.type === "new") URL.revokeObjectURL(image.previewUrl);
    setImageItems((prev) => prev.filter((item) => getImageUrl(item) !== getImageUrl(image)));
  };

  const handleCloseModal = (open: boolean) => {
    if (!open) requestClose();
  };

  return (
    <Dialog open onOpenChange={handleCloseModal}>
      {/* Dialog가 닫히려고 할 때(close 이벤트가 발생했을 때) Zustand의 close()도 호출 */}
      <DialogContent className="max-h-[80vh]">
        <DialogTitle>{mode === "edit" ? "포스트 수정" : "포스트 작성"}</DialogTitle>
        <textarea
          ref={textAreaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="max-h-125 min-h-24 rounded-md border p-4 focus:outline-none"
          placeholder="어떤일을 기록할까요?"
        />
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            onChange={handleSelectImages}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
          />
          {imageItems.length > 0 && (
            <Carousel>
              <CarouselContent>
                {imageItems.map((image) => (
                  <CarouselItem key={getImageUrl(image)} className="basis-2/5">
                    <div className="bg-muted-foreground relative h-24">
                      <img
                        src={getImageUrl(image)}
                        alt=""
                        className="h-full w-full rounded-sm object-contain"
                      />
                      <Button
                        onClick={() => {
                          handleDeleteImage(image);
                        }}
                        className="absolute top-0 right-0 m-1 aspect-square cursor-pointer rounded-full bg-black/30 p-1"
                      >
                        <XIcon className="size-4 text-white" />
                      </Button>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
          <Button
            onClick={() => {
              fileInputRef.current?.click();
            }}
            variant={"outline"}
            className="cursor-pointer"
          >
            이미지 추가
            <ImageIcon size={20} />
          </Button>
          <Button
            className="cursor-pointer"
            disabled={isCreatePostPending || isUpdatePostPending}
            onClick={handleSavePostClick}
          >
            저장
          </Button>
        </div>
      </DialogContent>
      <AlertModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="아직 작성 중인 내용이 있어요"
        description="지금 닫으면 작성 중인 내용이 사라져요. 그래도 닫으시겠어요?"
        cancelText="계속 작성"
        confirmText="닫기"
        onConfirm={confirmDiscard}
      />
    </Dialog>
  );
}
