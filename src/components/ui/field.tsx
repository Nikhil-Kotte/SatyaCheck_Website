import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-line/20 bg-canvas/60 px-4 py-3 text-base text-fg sm:text-[15px] placeholder:text-fg-subtle transition-[border-color,box-shadow,background-color] duration-200 hover:border-line/35 focus:border-brand focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/15";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
  className?: string;
};

export function Field({ id, label, required, optional, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-fg">
        {label}
        {required && (
          <span className="text-brand" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="font-normal text-fg-subtle">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

export function FormError({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="alert" className={cn("flex items-start gap-2.5 rounded-xl border border-risk/30 bg-risk/10 p-3.5 text-sm text-risk", className)}>
      {children}
    </div>
  );
}
