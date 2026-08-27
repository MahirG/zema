import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Create account", description: "Create a Zema early-access artist account." };
export default function SignupPage(): React.JSX.Element { return <AuthForm mode="signup" />; }
