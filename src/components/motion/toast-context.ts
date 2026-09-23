import { createContext } from "react";

export type ToastTone = "success" | "error" | "info";
export type Toast = { id: number; title: string; description?: string; tone: ToastTone };
export type ToastInput = Omit<Toast, "id">;

export const ToastContext = createContext<((t: ToastInput) => void) | null>(null);
