"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function HashRouteBridge(): null {
  const router = useRouter();

  useEffect(() => {
    const sync = (): void => {
      const hash = window.location.hash;
      if (!hash.startsWith("#/")) return;
      const path = hash.slice(1) || "/";
      router.replace(path);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [router]);
  return null;
}
