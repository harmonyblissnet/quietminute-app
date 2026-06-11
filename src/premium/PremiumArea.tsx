import { useAuth } from "../auth/AuthContext";
import { AuthScreen } from "../auth/AuthScreen";

// The gated "members" space. Phase 1 is the gate itself — sign in / create an
// account — with a gentle placeholder behind it until the daily practice
// content (exercises, audio, texts) is ready to drop in.
export function PremiumArea({ onBack }: { onBack: () => void }) {
  const { configured, loading, user, signOut } = useAuth();

  // Accounts not wired up yet — degrade gracefully (this view is normally
  // unreachable, since the entry link is hidden when Supabase is unconfigured).
  if (!configured) {
    return (
      <div className="flow">
        <p className="flow-eyebrow">Daily practice</p>
        <h2 className="flow-title">This space is<br />being prepared.</h2>
        <p className="flow-body">
          Member accounts aren't switched on just yet.
          <br />
          The practice above is always open to you.
        </p>
        <button className="btn-back" onClick={onBack}>← back</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flow">
        <p className="flow-body">one moment…</p>
      </div>
    );
  }

  // Not signed in → show the gate.
  if (!user) {
    return (
      <div className="flow">
        <AuthScreen />
        <button className="btn-back" onClick={onBack}>← back to the free practice</button>
      </div>
    );
  }

  // Signed in → the placeholder members area.
  return (
    <div className="flow">
      <div className="account-bar">
        <span>signed in as {user.email}</span>
        <button className="btn-link" onClick={() => void signOut()}>sign out</button>
      </div>
      <p className="flow-eyebrow">Daily practice</p>
      <h2 className="flow-title">this space is being<br />gently prepared.</h2>
      <p className="flow-body">
        your daily exercises, audio, and reflections
        <br />
        will live here soon. thank you for being early.
      </p>
      <button className="btn-back" onClick={onBack}>← back to the free practice</button>
    </div>
  );
}
