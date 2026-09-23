/**
 * @author: @kokonut-labs
 * @description: Loader (adapted for SatyaCheck)
 * @version: 1.0.0
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
}

/** Spinning arc in the current text colour, so it works on any button. */
export default function Loader({ title, subtitle, size = "sm", className, ...props }: LoaderProps) {
  const sizes = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };

  return (
    <div className={cn("inline-flex items-center gap-2", className)} role="status" {...props}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        className={cn("rounded-full border-2 border-current border-r-transparent opacity-90", sizes[size])}
        aria-hidden="true"
      />
      {title && <span className="text-sm font-medium">{title}</span>}
      {subtitle && <span className="text-xs opacity-70">{subtitle}</span>}
    </div>
  );
}
