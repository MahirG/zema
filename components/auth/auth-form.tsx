"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { useZemaStore } from "@/lib/store/zema-store";
import { firstName } from "@/lib/utils";

export function AuthForm({ mode }: { mode: "login" | "signup" }): React.JSX.Element {
  const router = useRouter();
  const toast = useToast();
  const loginDemo = useZemaStore((state) => state.loginDemo);
  const signup = useZemaStore((state) => state.signup);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(mode === "login" ? "abel@demo.et" : "");
  const [password, setPassword] = useState(mode === "login" ? "demopass" : "");

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setPending(true);
    window.setTimeout(() => {
      if (mode === "login") {
        const user = loginDemo();
        toast(`Welcome back, ${firstName(user.name)}`);
      } else {
        signup(name || "New Artist", email || "artist@zema.et");
        toast("Account created — welcome to Zema");
      }
      router.push("/app");
    }, 420);
  };

  return (
    <>
      <MarketingHeader />
      <main id="main-content" className="auth-page">
        <section className="auth-story" aria-hidden="true"><div><span className="eyebrow">Upload → live → paid</span><h1>Your next release deserves a <span className="gold-text">clear way home.</span></h1><p>Distribution, splits, royalty statements and birr payouts — one rail built in Addis Ababa.</p></div><div className="auth-flow"><span>01 · Audio + metadata</span><i /><span>02 · 150+ platforms</span><i /><span>03 · Telebirr + bank</span></div></section>
        <section className="auth-card-wrap">
          <form className="auth-card" onSubmit={submit}>
            <div className="auth-card-heading"><span><Sparkles aria-hidden="true" />Early access</span><h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2><p>{mode === "login" ? "Log in to your Zema dashboard." : "Start distributing in minutes."}</p></div>
            {mode === "signup" && <div className="form-field"><label htmlFor="name">Artist / name</label><div className="input-with-icon"><UserRound aria-hidden="true" /><input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" /></div></div>}
            <div className="form-field"><label htmlFor="email">Email</label><div className="input-with-icon"><Mail aria-hidden="true" /><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" autoComplete="email" required /></div></div>
            <div className="form-field"><label htmlFor="password">Password</label><div className="input-with-icon"><LockKeyhole aria-hidden="true" /><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === "login" ? "••••••••" : "Create a password"} autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={6} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></div></div>
            <Button type="submit" size="lg" disabled={pending}>{pending ? "Opening Zema…" : mode === "login" ? "Log in" : "Create account"}<ArrowRight aria-hidden="true" /></Button>
            {mode === "login" && <div className="demo-tip"><Sparkles aria-hidden="true" /><span>Demo account is pre-filled — just tap <strong>Log in</strong> to explore with sample data.</span></div>}
            <p className="auth-swap">{mode === "login" ? "New here?" : "Already have one?"} <Link href={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "Create an account" : "Log in"}</Link></p>
          </form>
        </section>
      </main>
    </>
  );
}
