import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  name?: string | null;
  avatarUrl?: string | null;
  size?: "default" | "sm" | "lg";
  className?: string;
};

export function UserAvatar({ name, avatarUrl, size, className }: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name ? `${name}의 프로필 이미지` : ""} />}
      <AvatarFallback>{name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
    </Avatar>
  );
}
