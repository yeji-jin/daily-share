import Link from "next/link";
import { ProfileAvatar } from "../profile/profile-avatar";

export default function CommentItem() {
  return (
    <div className={"flex flex-col gap-8 border-b pb-5"}>
      <div className="flex items-start gap-4">
        <Link href={""}>
          <div className="flex h-full flex-col">
            <ProfileAvatar />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-2">
          <div className="font-bold">작성자의 이름</div>
          <div>댓글 컨텐츠</div>
          <div className="text-muted-foreground flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:underline">댓글</div>
              <div className="bg-border h-3 w-0.5"></div>
              <div>10분 전</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:underline">수정</div>
              <div className="bg-border h-3 w-0.5"></div>
              <div className="cursor-pointer hover:underline">삭제</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
