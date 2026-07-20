import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, ShieldCheck, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type AuthOAuth = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

function oauthApi(): AuthOAuth {
  // The auth.oauth namespace is beta and not in the generated types.
  const anyAuth = supabase.auth as unknown as { oauth: AuthOAuth };
  return anyAuth.oauth;
}

function safeRelative(next: string | null): string | null {
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id in URL.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      try {
        const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) {
          setError(error.message ?? "Could not load this authorization request.");
          return;
        }
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data);
      } catch (e: any) {
        if (active) setError(e?.message ?? String(e));
      }
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    try {
      const { data, error } = approve
        ? await oauthApi().approveAuthorization(authorizationId)
        : await oauthApi().denyAuthorization(authorizationId);
      if (error) {
        setBusy(false);
        setError(error.message ?? "The authorization server rejected the request.");
        return;
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setBusy(false);
        setError("No redirect returned by the authorization server.");
        return;
      }
      window.location.href = target;
    } catch (e: any) {
      setBusy(false);
      setError(e?.message ?? String(e));
    }
  }

  const clientName = details?.client?.name ?? details?.client?.client_name ?? "an app";
  const redirectUri: string | undefined =
    details?.client?.redirect_uri ?? details?.client?.redirect_uris?.[0];
  const scopes: string[] = Array.isArray(details?.scopes)
    ? details.scopes
    : typeof details?.scope === "string"
      ? details.scope.split(/\s+/).filter(Boolean)
      : [];

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="text-white/70 hover:text-white text-sm">
          ← Back to JasebKu Store
        </Link>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-navy text-white">
          {!details && !error && (
            <div className="flex items-center gap-3 text-white/70">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading authorization…
            </div>
          )}

          {error && (
            <div>
              <div className="flex items-center gap-2 text-red-300 font-semibold mb-2">
                <X className="w-5 h-5" /> Authorization error
              </div>
              <p className="text-white/70 text-sm">{error}</p>
            </div>
          )}

          {details && !error && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <span className="text-xs uppercase tracking-wider text-gold">Authorize access</span>
              </div>
              <h1 className="text-2xl font-black mb-2">
                Connect <span className="text-gold">{clientName}</span> to JasebKu Store
              </h1>
              <p className="text-white/70 text-sm mb-4">
                This lets {clientName} use JasebKu Store as you. It does not bypass this app's
                permissions or backend policies.
              </p>

              {redirectUri && (
                <p className="text-white/50 text-xs mb-4 break-all">
                  Redirect: <span className="text-white/70">{redirectUri}</span>
                </p>
              )}

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6">
                <p className="text-white/70 text-sm font-semibold mb-2">This will allow it to:</p>
                <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
                  <li>See your basic profile (username, name, avatar)</li>
                  <li>Read your order history</li>
                  <li>Browse the JasebKu Store catalog on your behalf</li>
                </ul>
                {scopes.length > 0 && (
                  <p className="text-white/40 text-xs mt-3">
                    Scopes: {scopes.join(" ")}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => decide(true)}
                  disabled={busy}
                  className="flex-1 gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold h-11"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                </Button>
                <Button
                  onClick={() => decide(false)}
                  disabled={busy}
                  variant="outline"
                  className="flex-1 border-white/20 text-white bg-white/5 hover:bg-white/10 h-11"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { safeRelative };
