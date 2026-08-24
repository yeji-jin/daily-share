import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  name?: string | null;
  avatarUrl?: string | null;
  size?: "default" | "sm" | "lg";
  className?: string;
};

export function ProfileAvatar({ name, avatarUrl, size, className }: ProfileAvatarProps) {
  return (
    <Avatar size={size} className={cn("border-border border", className)}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name ? `${name}의 프로필 이미지` : ""} />}
      <AvatarFallback>{name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
    </Avatar>
  );
}
