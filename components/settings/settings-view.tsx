"use client";

import { Check, Globe2, LogOut, RotateCcw, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/app-shell/page-header";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { PAYOUT_METHODS } from "@/lib/domain/constants";
import type { PayoutMethodKind } from "@/lib/domain/types";
import { selectCurrentUser, useZemaStore } from "@/lib/store/zema-store";

export function SettingsView(): React.JSX.Element {
  const router = useRouter();
  const toast = useToast();
  const user = useZemaStore(selectCurrentUser);
  const db = useZemaStore((state) => state.db);
  const updateProfile = useZemaStore((state) => state.updateProfile);
  const savePayoutMethod = useZemaStore((state) => state.savePayoutMethod);
  const setLocale = useZemaStore((state) => state.setLocale);
  const locale = useZemaStore((state) => state.locale);
  const logout = useZemaStore((state) => state.logout);
  const resetDemo = useZemaStore((state) => state.resetDemo);
  const defaultMethod = db.payoutMethods.find((item) => item.payeeId === user?.payeeId && item.isDefault);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [method, setMethod] = useState<PayoutMethodKind>(defaultMethod?.kind ?? "Telebirr");
  const [destination, setDestination] = useState(defaultMethod?.destination ?? "");

  const saveProfile = (event: FormEvent): void => { event.preventDefault(); updateProfile(name, email); toast("Profile saved"); };
  const saveMethod = (event: FormEvent): void => { event.preventDefault(); savePayoutMethod(method, destination); toast("Payout method saved"); };
  const signOut = (): void => { logout(); router.push("/"); };
  const reset = (): void => { resetDemo(); toast({ tone: "info", message: "Demo data restored" }); router.push("/login"); };

  return (
    <>
      <PageHeader title="Settings" eyebrow="Account" />
      <div className="settings-grid">
        <Panel><PanelHeader title="Profile" description="Your artist dashboard identity." /><form className="settings-form" onSubmit={saveProfile}><div className="form-grid"><div className="form-field"><label htmlFor="profile-name">Name</label><input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} /></div><div className="form-field"><label htmlFor="profile-email">Email</label><input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></div></div><Button size="sm" type="submit"><Save aria-hidden="true" />Save profile</Button></form></Panel>
        <Panel><PanelHeader title="Payout method" description="Where your ETB payout arrives." /><form className="settings-form" onSubmit={saveMethod}><div className="method-grid settings-methods">{PAYOUT_METHODS.map((value) => <label className={`method-option ${method === value ? "selected" : ""}`} key={value}><input type="radio" name="settings-method" checked={method === value} onChange={() => { setMethod(value); setDestination(""); }} />{method === value && <Check aria-hidden="true" />}{value}</label>)}</div><div className="form-field"><label htmlFor="payout-destination">{method === "Bank" ? "Account number" : "Phone number"}</label><input id="payout-destination" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder={method === "Bank" ? "1000xxxxxxxx" : "09xxxxxxxx"} /></div><Button size="sm" type="submit"><Save aria-hidden="true" />Save</Button></form></Panel>
        <Panel><PanelHeader title="Language" description="Marketing site language preference." /><div className="settings-language"><Globe2 aria-hidden="true" /><div><strong>Interface language</strong><p>App interface localization (Amharic, Afaan Oromo, Tigrinya, Somali) ships with production. The marketing site is already bilingual.</p></div><div className="language-toggle"><button type="button" className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")}>EN</button><button type="button" className={locale === "am" ? "active" : ""} onClick={() => setLocale("am")} lang="am">አማ</button></div></div></Panel>
        <Panel className="settings-danger"><PanelHeader title="Session & demo" description="Log out or restore the original Abel Bekele demo account." /><div className="settings-actions"><Button variant="ghost" onClick={signOut}><LogOut aria-hidden="true" />Log out</Button><Button variant="danger" onClick={reset}><RotateCcw aria-hidden="true" />Reset demo</Button></div></Panel>
      </div>
    </>
  );
}
