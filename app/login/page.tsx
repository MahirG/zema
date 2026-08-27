import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Log in", description: "Log in to your Zema artist dashboard." };
export default function LoginPage(): React.JSX.Element { return <AuthForm mode="login" />; }
