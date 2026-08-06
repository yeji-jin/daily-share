export function LoadingDotsFull() {
  return (
    <div className="fixed inset-0 z-50 flex h-dvh w-full justify-center bg-black/30">
      <span className="inline-flex items-center gap-2">
        <span className="bg-muted-foreground size-4 animate-bounce rounded-full [animation-delay:-0.3s]" />
        <span className="bg-muted-foreground size-4 animate-bounce rounded-full [animation-delay:-0.15s]" />
        <span className="bg-muted-foreground size-4 animate-bounce rounded-full" />
      </span>
    </div>
  );
}

export function LoadingDots() {
  return (
    <span className="flex items-center justify-center gap-2">
      <span className="bg-muted-foreground size-4 animate-bounce rounded-full [animation-delay:-0.3s]" />
      <span className="bg-muted-foreground size-4 animate-bounce rounded-full [animation-delay:-0.15s]" />
      <span className="bg-muted-foreground size-4 animate-bounce rounded-full" />
    </span>
  );
}
