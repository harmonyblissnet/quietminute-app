import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthContext";

// Account-based entitlement check. Reads the signed-in user's row from the
// `entitlements` table (Row Level Security lets them see only their own).
// Access is granted server-side by the Stripe webhook — never from the client —
// so it can't be faked, and it follows the account across devices.
export function useDailyAccess() {
  const { user, loading: authLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function check() {
      if (authLoading) return;
      if (!user || !supabase) {
        setHasAccess(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("entitlements")
        .select("daily_practice")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!active) return;
      setHasAccess(!error && data?.daily_practice === true);
      setLoading(false);
    }

    void check();
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  return { hasAccess, loading: loading || authLoading };
}
