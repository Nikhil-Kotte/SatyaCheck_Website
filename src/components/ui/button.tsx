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
  "group relative isolate inline-flex select-none items-center justify-center gap-2 rounded-[14px] font-display font-bold tracking-[-0.01em] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "pop pop-press !bg-brand-solid text-on-brand",
  secondary: "pop pop-press text-fg",
  ghost: "text-fg transition-colors hover:bg-fg/10",
  light: "pop-press border-2 border-ink bg-white text-ink shadow-[5px_5px_0_0_#0A0B1C]",
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
