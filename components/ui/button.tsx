import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "gold" | "ghost" | "quiet" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export function buttonStyles({ variant = "gold", size = "md", className }: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}): string {
  return cn("button", `button-${variant}`, `button-${size}`, className);
}

export function Button({ variant = "gold", size = "md", className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }): React.JSX.Element {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}
