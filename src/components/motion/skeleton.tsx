import { cn } from "@/lib/utils";

/**
 * Placeholder block with a soft shimmer, shown while something loads
 * (for example the demo video). The shimmer stops under reduced motion.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-2xl bg-brand/[0.06]",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent",
        "motion-reduce:before:hidden",
        className
      )}
    />
  );
}
