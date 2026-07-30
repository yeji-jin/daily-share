export function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="bg-muted-foreground size-4 animate-bounce rounded-full [animation-delay:-0.3s]" />
      <span className="bg-muted-foreground size-4 animate-bounce rounded-full [animation-delay:-0.15s]" />
      <span className="bg-muted-foreground size-4 animate-bounce rounded-full" />
    </span>
  );
}
