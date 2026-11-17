"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type Toast = { id: number; message: string };

const ToastContext = createContext<(message: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((message: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {/* Toast stack — fixed bottom-right, above everything */}
      <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-[9999] flex flex-col gap-2 sm:bottom-6 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-2.5 border-2 border-foreground bg-background px-4 py-3 text-sm leading-6 text-foreground shadow-[4px_4px_0_var(--foreground)] toast-in"
          >
            <CheckCircle2
              size={16}
              className="mt-1 shrink-0 text-amber"
              aria-hidden="true"
            />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
