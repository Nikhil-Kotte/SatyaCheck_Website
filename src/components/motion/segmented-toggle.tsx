import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Option<T extends string> = { value: T; label: string };

type SegmentedToggleProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the group, e.g. "I am a". */
  label: string;
  /** Columns in the phone layout (below 640px), where options sit in a grid. */
  mobileColumns?: number;
  className?: string;
};

/**
 * Single-choice control with a highlight that glides between options. A pill
 * row from 640px up; on phones a grid of equal cells, so long labels never
 * wrap the pill into a broken shape. Works as a radio group for keyboards
 * and screen readers.
 */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  label,
  mobileColumns = 2,
  className,
}: SegmentedToggleProps<T>) {
  const id = useId();
  const reduce = useReducedMotion();

  const onKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = options[(index + dir + options.length) % options.length];
    onChange(next.value);
    document.getElementById(`${id}-${next.value}`)?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      style={{ gridTemplateColumns: `repeat(${mobileColumns}, minmax(0, 1fr))` }}
      className={cn(
        "grid w-full gap-1 rounded-2xl border border-line/15 bg-surface/70 p-1 backdrop-blur",
        "sm:inline-flex sm:w-auto sm:flex-nowrap sm:rounded-full",
        className
      )}
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            id={`${id}-${opt.value}`}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              "relative min-h-11 rounded-xl px-2 py-2 text-center text-[13px] font-medium leading-tight transition-colors duration-300 sm:rounded-full sm:px-4 sm:text-sm",
              selected ? "text-on-brand" : "text-fg-muted hover:text-fg"
            )}
          >
            {selected && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-xl bg-brand-solid sm:rounded-full shadow-[0_6px_20px_-6px_rgb(var(--brand-solid)/0.8)]"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
