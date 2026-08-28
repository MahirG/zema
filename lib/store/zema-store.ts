"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_INTERFACE_LOCALE, resolveInterfaceLocale } from "@/lib/config/interface";
import { advanceDeliveries, importDemoStatement, requestPayout, submitReleaseDraft } from "@/lib/domain/engine";
import { nextId } from "@/lib/domain/identifiers";
import { createSeedDatabase } from "@/lib/domain/seed";
import type { Locale, PayoutMethodKind, ReleaseDraft, User, ZemaDatabase } from "@/lib/domain/types";

interface ZemaState {
  db: ZemaDatabase;
  sessionUserId: string | null;
  locale: Locale;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setLocale: (locale: Locale) => void;
  loginDemo: () => User;
  signup: (name: string, email: string) => User;
  logout: () => void;
  resetDemo: () => void;
  submitRelease: (draft: ReleaseDraft) => { releaseId?: string; errors: string[] };
  progressDelivery: (releaseId: string) => void;
  importStatement: () => { grossMinor?: number; lineCount?: number; error?: string };
  withdraw: (amountMinorUsd: number, method: PayoutMethodKind, fxRate: number) => { amountMinorEtb?: number; error?: string };
  updateProfile: (name: string, email: string) => void;
  savePayoutMethod: (method: PayoutMethodKind, destination: string) => void;
}

const nowIso = (): string => new Date().toISOString();

export const useZemaStore = create<ZemaState>()(
  persist(
    (set, get) => ({
      db: createSeedDatabase(),
      sessionUserId: null,
      locale: DEFAULT_INTERFACE_LOCALE,
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      setLocale: (requestedLocale) => set((state) => {
        const locale = resolveInterfaceLocale(requestedLocale);
        return { locale, db: { ...state.db, users: state.db.users.map((user) => user.id === state.sessionUserId ? { ...user, locale } : user) } };
      }),
      loginDemo: () => {
        const user = get().db.users.find((item) => item.id === "user_abel") ?? get().db.users[0];
        if (!user) throw new Error("Demo user is missing.");
        set({ sessionUserId: user.id, locale: resolveInterfaceLocale(user.locale) });
        return user;
      },
      signup: (name, email) => {
        const db = structuredClone(get().db);
        const createdAt = nowIso();
        const userId = nextId(db, "user");
        const payeeId = nextId(db, "payee");
        const artistId = nextId(db, "artist");
        const safeName = name.trim() || "New Artist";
        const safeEmail = email.trim() || "artist@zema.et";
        const user: User = { id: userId, name: safeName, email: safeEmail, payeeId, locale: resolveInterfaceLocale(get().locale), createdAt };
        db.users.push(user);
        db.payees.push({ id: payeeId, ownerId: userId, name: safeName.split(" ")[0] ?? safeName, role: "You", email: safeEmail, payoutReady: false });
        db.artists.push({ id: artistId, ownerId: userId, name: safeName, countryCode: "ET" });
        db.auditLog.push({ id: nextId(db, "audit"), actorId: userId, action: "user.created", entityType: "user", entityId: userId, data: {}, createdAt });
        set({ db, sessionUserId: userId });
        return user;
      },
      logout: () => set({ sessionUserId: null }),
      resetDemo: () => set({ db: createSeedDatabase(), sessionUserId: null, locale: DEFAULT_INTERFACE_LOCALE }),
      submitRelease: (draft) => {
        const sessionUserId = get().sessionUserId;
        if (!sessionUserId) return { errors: ["Log in before submitting a release."] };
        const result = submitReleaseDraft(get().db, sessionUserId, draft, nowIso());
        if (result.releaseId) set({ db: result.db });
        return { ...(result.releaseId ? { releaseId: result.releaseId } : {}), errors: result.errors };
      },
      progressDelivery: (releaseId) => set((state) => ({ db: advanceDeliveries(state.db, releaseId, nowIso()) })),
      importStatement: () => {
        const result = importDemoStatement(get().db, nowIso());
        if (result.report) {
          set({ db: result.db });
          return { grossMinor: result.report.grossMinor, lineCount: result.report.lineCount };
        }
        return { error: result.error ?? "Statement import failed." };
      },
      withdraw: (amountMinorUsd, method, fxRate) => {
        const user = get().db.users.find((item) => item.id === get().sessionUserId);
        if (!user) return { error: "Log in before requesting a payout." };
        const result = requestPayout(get().db, user.payeeId, amountMinorUsd, method, fxRate, nowIso());
        if (result.payout) {
          set({ db: result.db });
          return { amountMinorEtb: result.payout.amountMinor };
        }
        return { error: result.error ?? "Payout could not be created." };
      },
      updateProfile: (name, email) => {
        const id = get().sessionUserId;
        if (!id) return;
        set((state) => ({
          db: {
            ...state.db,
            users: state.db.users.map((user) => user.id === id ? { ...user, name: name.trim() || user.name, email: email.trim() || user.email } : user),
          },
        }));
      },
      savePayoutMethod: (kind, destination) => {
        const state = get();
        const user = state.db.users.find((item) => item.id === state.sessionUserId);
        if (!user) return;
        const db = structuredClone(state.db);
        db.payoutMethods.forEach((method) => { if (method.payeeId === user.payeeId) method.isDefault = false; });
        const existing = db.payoutMethods.find((method) => method.payeeId === user.payeeId && method.kind === kind);
        if (existing) {
          existing.destination = destination;
          existing.isDefault = true;
        } else {
          db.payoutMethods.push({ id: nextId(db, "method"), payeeId: user.payeeId, kind, label: kind, destination, isDefault: true });
        }
        const payee = db.payees.find((item) => item.id === user.payeeId);
        if (payee) payee.payoutReady = Boolean(destination.trim());
        set({ db });
      },
    }),
    {
      name: "zema-domain-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ db: state.db, sessionUserId: state.sessionUserId, locale: state.locale }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ZemaState> | undefined;
        return {
          ...currentState,
          ...persisted,
          locale: resolveInterfaceLocale(persisted?.locale),
        };
      },
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

export const selectCurrentUser = (state: ZemaState): User | undefined => state.db.users.find((user) => user.id === state.sessionUserId);
