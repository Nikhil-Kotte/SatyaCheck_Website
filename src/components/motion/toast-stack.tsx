import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastContext, type Toast, type ToastInput } from "./toast-context";


/**
 * Stacked notifications in the bottom-right (bottom-centre on mobile).
 * Newest on top, older ones tucked behind; each dismisses after 5 s.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const reduce = useReducedMotion();

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (input: ToastInput) => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-2), { ...input, id }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  const value = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center sm:inset-x-auto sm:right-6 sm:items-end"
      >
        <AnimatePresence initial={false}>
          {[...toasts].reverse().map((t, i) => (
            <motion.div
              key={t.id}
              layout={!reduce}
              initial={{ opacity: 0, y: reduce ? 0 : 24, scale: 0.96 }}
              animate={{ opacity: 1 - i * 0.2, y: reduce ? 0 : -i * 10, scale: 1 - i * 0.04 }}
              exit={{ opacity: 0, y: reduce ? 0 : 12, scale: 0.96 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              style={{ zIndex: 10 - i, position: i === 0 ? "relative" : "absolute", bottom: 0 }}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-surface p-4 shadow-lift",
                t.tone === "error" ? "border-risk/40" : "border-line/20"
              )}
              role="status"
            >
              {t.tone === "error" ? (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-risk" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-fg">{t.title}</p>
                {t.description && <p className="mt-0.5 text-sm text-fg-muted">{t.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="rounded-full p-1 text-fg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
