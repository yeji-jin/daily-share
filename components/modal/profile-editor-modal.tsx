import { useEffect, useRef } from "react";
import { XIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useUser } from "@/stores/session";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import { LoadingDots } from "../ui/loading-dots";
import { ProfileAvatar } from "../profile/profile-avatar";
import { Input } from "../ui/input";
import { useUpdateProfile } from "@/hooks/mutations/profile/use-update-profile";
import { showErrorToast } from "@/lib/error";

type ProfileEditorValues = {
  nickname: string;
  bio: string;
  // { file, previewUrl }: 새 이미지로 교체, null: 기존 이미지 삭제, undefined: 변경 없음
  avatar?: {
    file: File;
    previewUrl: string;
  } | null;
};

export default function ProfileEditorModal({ onClose }: { onClose: () => void }) {
  const user = useUser();
  const { data: profile, isPending: isFetchingProfilePending } = useProfileData(user?.id);
  const { mutate: updateProfile, isPending: isUpdateProfilePending } = useUpdateProfile({
    onSuccess: () => {
      onClose();
    },
    onError: (error) => showErrorToast(error),
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ProfileEditorValues>({
    values: profile ? { nickname: profile.nickname, bio: profile.bio ?? "" } : undefined,
  });

  // 모달이 닫힐 때(unmount) 그 시점까지 골라둔 미리보기 URL을 정리하기 위한 최신값 참조
  const avatarRef = useRef<ProfileEditorValues["avatar"]>(undefined);
  avatarRef.current = watch("avatar");

  useEffect(() => {
    return () => {
      if (avatarRef.current) URL.revokeObjectURL(avatarRef.current.previewUrl);
    };
  }, []);

  if (isFetchingProfilePending) return <LoadingDots />;

  const handleUpdateClick = (values: ProfileEditorValues) => {
    updateProfile({
      userId: user!.id,
      nickname: values.nickname,
      bio: values.bio,
      avatarFile: values.avatar === null ? null : values.avatar?.file,
      previousAvatarUrl: profile?.avatar_url ?? null,
    });
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="flex flex-col gap-5">
        <DialogTitle>프로필 수정</DialogTitle>
        <form onSubmit={handleSubmit(handleUpdateClick)} className="flex flex-col gap-5">
          <fieldset disabled={isUpdateProfilePending} className="contents">
            <div className="flex flex-col gap-2">
              <p className="text-bold text-muted-foreground">프로필 이미지</p>
              <Controller
                control={control}
                name="avatar"
                render={({ field }) => {
                  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (field.value) URL.revokeObjectURL(field.value.previewUrl);
                    field.onChange({ file, previewUrl: URL.createObjectURL(file) });
                  };

                  const hasPendingChange = field.value !== undefined;

                  const handleClearClick = () => {
                    if (hasPendingChange) {
                      if (field.value) URL.revokeObjectURL(field.value.previewUrl);
                      field.onChange(undefined);
                    } else {
                      field.onChange(null);
                    }
                  };

                  const currentAvatarUrl =
                    field.value === null
                      ? undefined
                      : (field.value?.previewUrl ?? profile?.avatar_url);

                  const showClearButton = hasPendingChange || !!profile?.avatar_url;
                  const clearButtonLabel = hasPendingChange ? "변경 취소" : "기존 이미지 삭제";

                  return (
                    <div className="relative w-fit">
                      <label>
                        <ProfileAvatar
                          name={profile?.nickname}
                          avatarUrl={currentAvatarUrl}
                          className="size-20 cursor-pointer"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                      {showClearButton && (
                        <button
                          type="button"
                          onClick={handleClearClick}
                          className="absolute top-0 right-0 cursor-pointer rounded-full bg-black/50 p-1"
                        >
                          <XIcon className="size-3 text-white" />
                          <span className="sr-only">{clearButtonLabel}</span>
                        </button>
                      )}
                    </div>
                  );
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-bold text-muted-foreground">닉네임</p>
              <Input
                type="text"
                {...register("nickname", {
                  validate: (value) => value.trim().length > 0 || "닉네임을 입력해주세요.",
                })}
              />
              {errors.nickname && (
                <p className="text-destructive text-sm">{errors.nickname.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-bold text-muted-foreground">소개</p>
              <Input type="text" {...register("bio")} />
            </div>
            <Button type="submit" className="cursor-pointer">
              수정하기
            </Button>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
