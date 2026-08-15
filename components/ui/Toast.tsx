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
      <div className="pointer-events-none fixed bottom-6 right-6 z-9999 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-center gap-2.5 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-foreground shadow-xl toast-in"
          >
            <CheckCircle2 size={16} className="shrink-0 text-purple" />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
