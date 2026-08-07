export function GradientBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="drift-a absolute -top-32 -left-32 size-[28rem] rounded-full bg-primary/25 blur-[100px] sm:size-[36rem]" />
      <div className="drift-b absolute top-1/3 -right-32 size-[28rem] rounded-full bg-positive/20 blur-[100px] sm:size-[36rem]" />
      <div className="drift-a absolute bottom-0 left-1/4 size-[24rem] rounded-full bg-primary/15 blur-[100px]" />
    </div>
  );
}
