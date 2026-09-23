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
  className?: string;
};

/**
 * Pill-shaped single-choice control with a highlight that glides between
 * options. Works as a radio group for keyboards and screen readers.
 */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  label,
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
      className={cn("inline-flex flex-wrap gap-1 rounded-full border border-line/15 bg-surface/70 p-1 backdrop-blur", className)}
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
              "relative min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
              selected ? "text-on-brand" : "text-fg-muted hover:text-fg"
            )}
          >
            {selected && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-full bg-brand-solid shadow-[0_6px_20px_-6px_rgb(var(--brand-solid)/0.8)]"
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
