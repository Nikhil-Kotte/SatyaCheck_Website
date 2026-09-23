import { useRef, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToHash } from "@/lib/smooth-scroll";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Leading icon. */
  icon?: ReactNode;
  /** Show a trailing arrow that nudges forward on hover. */
  arrow?: boolean;
  /** Pull the button gently toward the cursor. */
  magnetic?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
  ariaLabel?: string;
};

const base =
  "group relative isolate inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-display font-semibold tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform] duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-solid text-on-brand shadow-[0_10px_30px_-10px_rgb(var(--brand-solid)/0.7),inset_0_1px_0_rgb(255_255_255/0.25)] hover:shadow-[0_18px_44px_-10px_rgb(var(--brand-solid)/0.85),inset_0_1px_0_rgb(255_255_255/0.3)]",
  secondary:
    "border border-line/25 bg-surface/60 text-fg backdrop-blur hover:border-brand/60 hover:bg-surface hover:text-brand",
  ghost: "text-fg hover:bg-brand/10 hover:text-brand",
  light: "bg-white text-[#0B0D2A] hover:bg-white/90 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  icon,
  arrow,
  magnetic = false,
  type = "button",
  disabled,
  external,
  ariaLabel,
}: ButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: MouseEvent) => {
    if (!magnetic || reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.32);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const inner = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/3 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 group-hover:animate-shine group-hover:opacity-100"
        />
      )}
      {icon}
      <span>{children}</span>
      {arrow && (
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  const classes = cn(base, variants[variant], sizes[size], className);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (href?.startsWith("#")) {
      if (scrollToHash(href)) e.preventDefault();
    }
    onClick?.(e);
  };

  let el: ReactNode;
  if (href && href.startsWith("/") && !external) {
    el = (
      <Link to={href} className={classes} onClick={handleClick} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  } else if (href) {
    el = (
      <a
        href={href}
        className={classes}
        onClick={handleClick}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  } else {
    el = (
      <button type={type} className={classes} onClick={handleClick} disabled={disabled} aria-label={ariaLabel}>
        {inner}
      </button>
    );
  }

  if (!magnetic) return el;
  return (
    <motion.span ref={ref} className="inline-flex" style={{ x, y }} onMouseMove={onMove} onMouseLeave={onLeave}>
      {el}
    </motion.span>
  );
}
