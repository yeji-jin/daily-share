import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { useModal } from "@/stores/modal";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { showErrorToast } from "@/lib/error";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { useIsUserLoaded, useUser } from "@/stores/session";
import AlertModal from "@/components/modal/alert-modal";

type Image = {
  file: File;
  previewUrl: string;
};

export default function PostEditorModal() {
  const user = useUser();
  const isUserLoaded = useIsUserLoaded();
  const { close } = useModal();
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<Image[]>([]);
  const [isConfirmCloseOpen, setIsConfirmCloseOpen] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      close();
    },
    onError: (error) => showErrorToast(error, "포스트 생성에 실패했습니다"),
  });

  const handleCreatePost = () => {
    if (content.trim() === "" || !isUserLoaded) return;
    createPost({ content, images: images.map((image) => image.file), userId: user!.id });
  };

  const handleSelectImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        setImages((prev) => [...prev, { file, previewUrl: URL.createObjectURL(file) }]);
      });
    }
    e.target.value = "";
  };

  const handleDeleteImage = (image: Image) => {
    URL.revokeObjectURL(image.previewUrl);
    setImages((prevImages) => prevImages.filter((item) => item.previewUrl !== image.previewUrl));
  };

  const handleCloseModal = (open: boolean) => {
    if (open) return;

    if (content !== "" || images.length !== 0) {
      setIsConfirmCloseOpen(true);
      return;
    }

    close();
  };

  const handleConfirmClose = () => {
    close();
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

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  return (
    <Dialog open onOpenChange={handleCloseModal}>
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
          <input
            ref={fileInputRef}
            onChange={handleSelectImages}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
          />
          {images.length > 0 && (
            <Carousel>
              <CarouselContent>
                {images.map((image) => (
                  <CarouselItem key={image.previewUrl} className="basis-2/5">
                    <div className="bg-muted-foreground relative h-24">
                      <img
                        src={image.previewUrl}
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
            disabled={isCreatePostPending}
            onClick={handleCreatePost}
          >
            저장
          </Button>
        </div>
      </DialogContent>
      <AlertModal
        open={isConfirmCloseOpen}
        onOpenChange={setIsConfirmCloseOpen}
        title="아직 작성 중인 내용이 있어요"
        description="지금 닫으면 작성 중인 내용이 사라져요. 그래도 닫으시겠어요?"
        cancelText="계속 작성"
        confirmText="닫기"
        onConfirm={handleConfirmClose}
      />
    </Dialog>
  );
}
