import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, children, ...props }: HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("panel-card", className)} {...props}>{children}</div>;
}

export function PanelHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }): React.JSX.Element {
  return (
    <div className="panel-header">
      <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
      {action}
    </div>
  );
}
