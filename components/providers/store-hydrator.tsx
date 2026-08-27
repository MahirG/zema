"use client";

import { useEffect } from "react";
import { useZemaStore } from "@/lib/store/zema-store";

export function StoreHydrator(): null {
  useEffect(() => {
    void useZemaStore.persist.rehydrate();
  }, []);
  return null;
}
