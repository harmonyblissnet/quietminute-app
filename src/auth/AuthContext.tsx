import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

type AuthResult = { error: string | null };

type AuthContextValue = {
  // Whether Supabase env vars are present. When false, the app runs fully as the
  // free, account-less experience.
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  signInWithMagicLink: (email: string) => Promise<AuthResult>;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (
    email: string,
    password: string,
  ) => Promise<AuthResult & { needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
};

const NOT_CONFIGURED = "Accounts aren't switched on yet.";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;

    // Restore any existing session on load…
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    // …then keep it in sync (sign in, sign out, magic-link return, token refresh).
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      session,
      user: session?.user ?? null,

      async signInWithMagicLink(email) {
        if (!supabase) return { error: NOT_CONFIGURED };
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: window.location.origin },
        });
        return { error: error?.message ?? null };
      },

      async signInWithPassword(email, password) {
        if (!supabase) return { error: NOT_CONFIGURED };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },

      async signUpWithPassword(email, password) {
        if (!supabase) return { error: NOT_CONFIGURED, needsConfirmation: false };
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        // When email confirmation is on, signUp returns no session until the
        // user clicks the link in their inbox.
        const needsConfirmation = !error && !data.session;
        return { error: error?.message ?? null, needsConfirmation };
      },

      async signOut() {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    }),
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
