"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { CommentForm, CommentMode, EditMode } from "@/types/comment";
import { useCreateComment } from "@/hooks/mutations/comment/use-create-comment";
import { showErrorToast } from "@/lib/error";
import { useEffect } from "react";
import { useUpdateComment } from "@/hooks/mutations/comment/use-update-comment";

export default function CommentEditor(props: CommentMode) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CommentForm>({
    mode: "onChange",
  });

  useEffect(() => {
    if (props.type === "EDIT") {
      reset({
        content: props.initialContent,
      });
    }
  }, [props.type, reset]);

  const { mutate: createComment, isPending: isCreatePending } = useCreateComment({
    onSuccess: () => {
      reset();
    },
    onError: (error) => showErrorToast(error),
  });

  const { mutate: updateComment, isPending: isPendingUpdateComment } = useUpdateComment({
    onSuccess: () => {
      (props as EditMode).onClose();
      reset();
    },
    onError: (error) => showErrorToast(error),
  });

  const onSubmitComment = ({ content }: CommentForm) => {
    if (props.type === "CREATE") {
      createComment({
        postId: props.postId,
        content,
      });
    } else {
      updateComment({
        id: props.commentId,
        content,
      });
    }
  };

  const isPending = isCreatePending || isPendingUpdateComment;
  return (
    <form onSubmit={handleSubmit(onSubmitComment)} className="flex flex-col gap-2">
      <Textarea
        {...register("content", {
          required: "댓글을 입력해주세요.",
          validate: (value) => value.trim().length > 0,
        })}
        disabled={isPending}
      />
      {errors.content && <p>{errors.content.message}</p>}

      <div className="flex justify-end gap-2">
        {props.type === "EDIT" && (
          <Button type="button" variant={"outline"} onClick={props.onClose} disabled={isPending}>
            취소
          </Button>
        )}
        <Button type="submit" disabled={!isValid || isPending}>
          작성
        </Button>
      </div>
    </form>
  );
}
