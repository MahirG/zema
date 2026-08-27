"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

type ToastTone = "success" | "error" | "info";

interface ToastPayload {
  message: string;
  tone?: ToastTone;
}

interface ToastItem extends ToastPayload {
  id: number;
}

const ToastContext = createContext<((payload: ToastPayload | string) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback((payload: ToastPayload | string) => {
    const value = typeof payload === "string" ? { message: payload, tone: "success" as const } : payload;
    const id = nextId.current;
    nextId.current += 1;
    setItems((current) => [...current.slice(-2), { id, ...value }]);
    window.setTimeout(() => dismiss(id), 3_600);
  }, [dismiss]);

  const api = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-region" role="region" aria-label="Notifications" aria-live="polite">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const Icon = item.tone === "error" ? CircleAlert : item.tone === "info" ? Info : CheckCircle2;
            return (
              <motion.div
                key={item.id}
                className={`toast toast-${item.tone ?? "success"}`}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              >
                <Icon aria-hidden="true" />
                <span>{item.message}</span>
                <button type="button" onClick={() => dismiss(item.id)} aria-label="Dismiss notification"><X aria-hidden="true" /></button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): (payload: ToastPayload | string) => void {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider.");
  return context;
}
