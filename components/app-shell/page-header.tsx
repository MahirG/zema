"use client";

import type { ReactNode } from "react";
import { selectCurrentUser, useZemaStore } from "@/lib/store/zema-store";

export function PageHeader({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: ReactNode }): React.JSX.Element {
  const user = useZemaStore(selectCurrentUser);
  return (
    <div className="app-page-header">
      <div>{eyebrow && <span>{eyebrow}</span>}<h1>{title}</h1></div>
      <div className="desktop-user"><span>{user?.name ?? "Artist"}</span><div className="avatar">{user?.name.charAt(0) ?? "A"}</div></div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  );
}
