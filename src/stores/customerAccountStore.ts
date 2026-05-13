import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { refreshAccessToken } from "@/lib/shopify-customer-account";

const STORAGE_KEY = "dardgo-customer-account";

export type CustomerSession = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAtMs: number;
};

type CustomerAccountStore = {
  session: CustomerSession | null;
  setSession: (s: CustomerSession) => void;
  clearSession: () => void;
  /** Returns a valid access token or null if logged out / refresh failed. */
  getValidAccessToken: () => Promise<string | null>;
};

export const useCustomerAccountStore = create<CustomerAccountStore>()(
  persist(
    (set, get) => ({
      session: null,

      setSession: (s) => set({ session: s }),

      clearSession: () => set({ session: null }),

      getValidAccessToken: async () => {
        const { session } = get();
        if (!session?.accessToken) return null;

        const skewMs = 60_000;
        if (Date.now() < session.expiresAtMs - skewMs) {
          return session.accessToken;
        }

        try {
          const next = await refreshAccessToken(session.refreshToken);
          const expiresAtMs = Date.now() + next.expires_in * 1000;
          set({
            session: {
              accessToken: next.access_token,
              refreshToken: next.refresh_token ?? session.refreshToken,
              idToken: next.id_token ?? session.idToken,
              expiresAtMs,
            },
          });
          return next.access_token;
        } catch {
          set({ session: null });
          return null;
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ session: s.session }),
    },
  ),
);
