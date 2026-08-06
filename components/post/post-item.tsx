import { HeartIcon, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Post } from "@/types/post";
import { Profile } from "@/types/profile";
import { formatTimeAgo } from "@/lib/time";

type PostDetail = Post & {
  author: Profile;
};

export default function PostItem(post: PostDetail) {
  return (
    <div className="flex flex-col gap-4 border-b pb-8">
      <div className="flex justify-between">
        {/* user info */}
        <div className="flex items-start gap-4">
          <Avatar size="lg">
            <AvatarImage
              src={post.author.avatar_url ?? undefined}
              alt={`${post.author.nickname}의 프로필 이미지`}
            />
            <AvatarFallback>{post.author.nickname[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold hover:underline">{post.author.nickname}</div>
            <div className="text-muted-foreground text-sm">{formatTimeAgo(post.created_at)}</div>
          </div>
        </div>

        {/* edit, delete */}
        <div className="text-muted-foreground flex text-sm">
          <Button className="cursor-pointer" variant={"ghost"}>
            수정
          </Button>
          <Button className="cursor-pointer" variant={"ghost"}>
            삭제
          </Button>
        </div>
      </div>

      {/* contents */}
      <div className="flex cursor-pointer flex-col gap-5">
        {/*content */}
        <div className="line-clamp-2 wrap-break-word whitespace-pre-wrap">{post.content}</div>
        {/* images */}
        <Carousel>
          <CarouselContent>
            {post.image_urls?.map((url, index) => (
              <CarouselItem className="basis-3/5" key={index}>
                <div className="overflow-hidden rounded-xl">
                  <img src={url} alt="" className="h-full max-h-87.5 w-full object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* 3. buttons*/}
      <div className="flex gap-2">
        {/* like button */}
        <div className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-4 text-sm">
          <HeartIcon className="h-4 w-4" />
          <span>{post.like}</span>
        </div>

        {/* comment button */}
        <div className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-4 text-sm">
          <MessageCircle className="h-4 w-4" />
          <span>댓글 달기</span>
        </div>
      </div>
    </div>
  );
}
