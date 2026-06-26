"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, Info } from "lucide-react";

type ToastKind = "success" | "info" | "wish";
type Toast = { id: number; kind: ToastKind; message: string };

type ToastValue = { toast: (message: string, kind?: ToastKind) => void };

const ToastContext = createContext<ToastValue | null>(null);

const ICON = {
  success: Check,
  info: Info,
  wish: Heart,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((message: string, kind: ToastKind = "success") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[300] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICON[t.kind];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="glass-dark pointer-events-auto flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium text-[var(--color-cream)] shadow-[0_12px_40px_rgba(58,13,22,0.4)]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-gold)] text-[var(--color-maroon-deep)]">
                  <Icon size={14} strokeWidth={3} />
                </span>
                {t.message}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
