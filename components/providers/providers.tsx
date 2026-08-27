"use client";

import type { ReactNode } from "react";
import { HashRouteBridge } from "@/components/providers/hash-route-bridge";
import { StoreHydrator } from "@/components/providers/store-hydrator";
import { ToastProvider } from "@/components/providers/toast-provider";

export function Providers({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <ToastProvider>
      <StoreHydrator />
      <HashRouteBridge />
      {children}
    </ToastProvider>
  );
}
