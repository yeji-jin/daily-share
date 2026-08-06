"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">문제가 발생했어요</h1>
      <p className="text-muted-foreground text-sm">잠시 후 다시 시도해주세요</p>
      <Button onClick={() => reset()} className="cursor-pointer">
        다시 시도
      </Button>
    </div>
  );
}
