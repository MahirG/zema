"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BarChart3, Home, LogOut, Menu, Music2, Plus, Settings, WalletCards, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Brand } from "@/components/ui/brand";
import { buttonStyles } from "@/components/ui/button";
import { selectCurrentUser, useZemaStore } from "@/lib/store/zema-store";
import { cn, firstName } from "@/lib/utils";

const navigation = [
  { href: "/app", label: "Dashboard", mobileLabel: "Home", icon: Home, exact: true },
  { href: "/app/music", label: "My Music", mobileLabel: "Music", icon: Music2 },
  { href: "/app/royalties", label: "Royalties", mobileLabel: "Royalties", icon: BarChart3 },
  { href: "/app/wallet", label: "Wallet", mobileLabel: "Money", icon: WalletCards },
  { href: "/app/settings", label: "Settings", mobileLabel: "More", icon: Settings },
] as const;

export function AppGate({ children }: { children: ReactNode }): React.JSX.Element {
  const router = useRouter();
  const hydrated = useZemaStore((state) => state.hydrated);
  const user = useZemaStore(selectCurrentUser);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, router, user]);

  if (!hydrated || !user) return <AppShellSkeleton />;
  return <AppShell>{children}</AppShell>;
}

export function AppShell({ children }: { children: ReactNode }): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const [mobileMenu, setMobileMenu] = useState(false);
  const user = useZemaStore(selectCurrentUser);
  const logout = useZemaStore((state) => state.logout);
  if (!user) return <AppShellSkeleton />;

  const signOut = (): void => {
    logout();
    router.push("/");
  };
  const isActive = (href: string, exact?: boolean): boolean => exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="app-frame">
      <aside className="app-sidebar" aria-label="Dashboard navigation">
        <Brand />
        <Link href="/app/release/new" className={buttonStyles({ className: "new-release-button" })}><Plus aria-hidden="true" />New Release</Link>
        <nav>
          {navigation.map((item) => {
            const Icon = item.icon;
            return <Link key={item.href} href={item.href} className={cn("app-nav-link", isActive(item.href, "exact" in item ? item.exact : false) && "active")}><Icon aria-hidden="true" /><span>{item.label}</span>{isActive(item.href, "exact" in item ? item.exact : false) && <motion.i layoutId="app-nav-indicator" />}</Link>;
          })}
        </nav>
        <div className="sidebar-lift"><SparkCard /></div>
        <div className="sidebar-user"><div className="avatar">{user.name.charAt(0)}</div><div><strong>{firstName(user.name)}</strong><span>{user.email}</span></div><button type="button" onClick={signOut} aria-label="Log out"><LogOut aria-hidden="true" /></button></div>
      </aside>

      <div className="app-stage">
        <header className="mobile-app-header"><Brand /><button type="button" onClick={() => setMobileMenu(true)} aria-label="Open account menu"><Menu aria-hidden="true" /></button></header>
        <AnimatePresence mode="wait" initial={false}>
          <motion.main id="main-content" className="app-main" key={pathname} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -5 }} transition={{ duration: 0.24, ease: "easeOut" }}>
            {children}
          </motion.main>
        </AnimatePresence>
      </div>

      <nav className="mobile-tabbar" aria-label="Mobile dashboard navigation">
        {navigation.slice(0, 2).map((item) => <MobileTab key={item.href} item={item} active={isActive(item.href, "exact" in item ? item.exact : false)} />)}
        <Link href="/app/release/new" className="mobile-fab" aria-label="New release"><span><Plus aria-hidden="true" /></span></Link>
        {navigation.slice(3).map((item) => <MobileTab key={item.href} item={item} active={isActive(item.href)} />)}
      </nav>

      <AnimatePresence>
        {mobileMenu && <motion.div className="account-sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="account-sheet-scrim" type="button" onClick={() => setMobileMenu(false)} aria-label="Close account menu" /><motion.div className="account-sheet-panel" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 400, damping: 38 }}><div className="sheet-handle" /><div className="sheet-user"><div className="avatar">{user.name.charAt(0)}</div><div><strong>{user.name}</strong><span>{user.email}</span></div><button type="button" onClick={() => setMobileMenu(false)} aria-label="Close"><X aria-hidden="true" /></button></div><SparkCard /><button type="button" className={buttonStyles({ variant: "ghost", className: "sheet-logout" })} onClick={signOut}><LogOut aria-hidden="true" />Log out</button></motion.div></motion.div>}
      </AnimatePresence>
    </div>
  );
}

function MobileTab({ item, active }: { item: (typeof navigation)[number]; active: boolean }): React.JSX.Element {
  const Icon = item.icon;
  return <Link href={item.href} className={cn("mobile-tab", active && "active")} aria-current={active ? "page" : undefined}><Icon aria-hidden="true" /><span>{item.mobileLabel}</span></Link>;
}

function SparkCard(): React.JSX.Element {
  return <div className="spark-card"><span>Coming next</span><strong>Premium analytics</strong><p>Deeper country and fan insights, built into your earnings view.</p><Link href="/app/royalties">Preview insights <span aria-hidden="true">→</span></Link></div>;
}

export function AppShellSkeleton(): React.JSX.Element {
  return <div className="app-loading-shell" aria-label="Loading dashboard"><aside><div className="skeleton h-8 w-28" /><div className="skeleton mt-10 h-11 w-full" />{[1,2,3,4,5].map((item) => <div key={item} className="skeleton mt-4 h-10 w-full" />)}</aside><main><div className="skeleton h-10 w-52" /><div className="loading-stats">{[1,2,3,4].map((item) => <div key={item} className="skeleton h-32" />)}</div><div className="skeleton mt-5 h-80 w-full" /></main></div>;
}
