import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  exchangeAuthorizationCode,
  readPkceState,
  clearPkceSession,
} from "@/lib/shopify-customer-account";
import { useCustomerAccountStore } from "@/stores/customerAccountStore";

type CallbackSearch = {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
};

export const Route = createFileRoute("/account/callback")({
  component: AccountCallbackPage,
  validateSearch: (search: Record<string, unknown>): CallbackSearch => ({
    code: typeof search.code === "string" ? search.code : undefined,
    state: typeof search.state === "string" ? search.state : undefined,
    error: typeof search.error === "string" ? search.error : undefined,
    error_description:
      typeof search.error_description === "string" ? search.error_description : undefined,
  }),
});

function AccountCallbackPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/account/callback" });
  const setSession = useCustomerAccountStore((s) => s.setSession);
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (search.error) {
        clearPkceSession();
        setMessage(search.error_description || search.error || "Login was cancelled.");
        return;
      }

      const code = search.code;
      const state = search.state;
      if (!code || !state) {
        clearPkceSession();
        setMessage("Missing authorization code. Try signing in again.");
        return;
      }

      const expected = readPkceState();
      if (!expected || expected !== state) {
        clearPkceSession();
        setMessage("Invalid login state (CSRF check). Please try again.");
        return;
      }

      try {
        const tokens = await exchangeAuthorizationCode(code);
        if (cancelled) return;
        const expiresAtMs = Date.now() + tokens.expires_in * 1000;
        setSession({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          idToken: tokens.id_token,
          expiresAtMs,
        });
        await navigate({ to: "/account", replace: true });
      } catch (e) {
        if (cancelled) return;
        clearPkceSession();
        setMessage(e instanceof Error ? e.message : "Could not complete sign-in.");
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [search.code, search.state, search.error, search.error_description, navigate, setSession]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground max-w-md">{message}</p>
    </div>
  );
}
