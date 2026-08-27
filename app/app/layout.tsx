import type { ReactNode } from "react";
import { AppGate } from "@/components/app-shell/app-shell";
import "@/components/app-shell/app.css";

export default function DashboardLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return <AppGate>{children}</AppGate>;
}
