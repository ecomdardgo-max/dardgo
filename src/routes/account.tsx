import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  LogIn,
  LogOut,
  Package,
  MapPin,
  User,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CUSTOMER_DASHBOARD_QUERY,
  customerAccountGraphql,
  getCustomerAccountConfigMessage,
  isCustomerAccountConfigured,
  redirectToShopifyKpAccount,
  logoutCustomer,
  type CustomerDashboardData,
  CUSTOMER_UPDATE_MUTATION,
  type CustomerUpdateResult,
} from "@/lib/shopify-customer-account";
import { useCustomerAccountStore } from "@/stores/customerAccountStore";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "My account — DARDGO" },
      { name: "description", content: "Sign in to view orders, addresses, and profile on DARDGO." },
    ],
  }),
});

function AccountPage() {
  const session = useCustomerAccountStore((s) => s.session);
  const clearSession = useCustomerAccountStore((s) => s.clearSession);
  const getValidAccessToken = useCustomerAccountStore((s) => s.getValidAccessToken);

  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<CustomerDashboardData | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const loadDashboard = useCallback(async () => {
    const token = await getValidAccessToken();
    if (!token) {
      setDashboard(null);
      return;
    }
    setLoading(true);
    try {
      const data = await customerAccountGraphql<CustomerDashboardData>(
        token,
        CUSTOMER_DASHBOARD_QUERY,
      );
      setDashboard(data);
      if (data.customer) {
        setFirstName(data.customer.firstName ?? "");
        setLastName(data.customer.lastName ?? "");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load account");
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, [getValidAccessToken]);

  useEffect(() => {
    if (session) void loadDashboard();
    else setDashboard(null);
  }, [session, loadDashboard]);

  const handleLogin = () => {
    redirectToShopifyKpAccount();
  };

  const handleLogout = () => {
    const idToken = useCustomerAccountStore.getState().session?.idToken;
    clearSession();
    setDashboard(null);
    if (idToken) {
      void logoutCustomer(idToken);
    }
  };

  const handleSaveProfile = async () => {
    const token = await getValidAccessToken();
    if (!token) return;
    setSavingProfile(true);
    try {
      const result = await customerAccountGraphql<CustomerUpdateResult>(
        token,
        CUSTOMER_UPDATE_MUTATION,
        {
          input: { firstName: firstName.trim() || null, lastName: lastName.trim() || null },
        },
      );
      const errors = result.customerUpdate?.userErrors ?? [];
      if (errors.length) {
        toast.error(errors.map((u) => u.message).join(", "));
        return;
      }
      toast.success("Profile updated");
      await loadDashboard();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const configured = isCustomerAccountConfigured();
  const configHint = getCustomerAccountConfigMessage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="py-8 sm:py-12 pb-28 lg:pb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-8 sm:mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-display mb-2">
                My account
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Sign in with your Shopify customer account to see orders and saved addresses.
              </p>
            </div>
          </ScrollReveal>

          {!configured && (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-sm text-foreground">
              <p className="font-semibold mb-2">Customer login not configured</p>
              <p className="text-muted-foreground leading-relaxed">{configHint}</p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                In Shopify Admin → <strong>Headless</strong> → <strong>Customer Account API</strong>
                , add this <strong>Redirect URL</strong>:{" "}
                <code className="rounded bg-background/80 px-1.5 py-0.5 text-xs">
                  {(import.meta.env.VITE_PUBLIC_APP_URL as string) || "https://your-domain"}
                  /account/callback
                </code>{" "}
                and the same origin under <strong>JavaScript origins</strong>.
              </p>
            </div>
          )}

          {configured && !session && (
            <ScrollReveal>
              <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-10 shadow-card text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Sign in</h2>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                  You&apos;ll be redirected to our secure Shopify account page to sign in or
                  register. Use the same login for orders on this store.
                </p>
                <Button
                  size="lg"
                  className="rounded-full font-bold gap-2"
                  onClick={handleLogin}
                >
                  Continue to sign in
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </ScrollReveal>
          )}

          {configured && session && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => void loadDashboard()}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="destructive" size="sm" className="gap-2" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Button>
              </div>

              {loading && !dashboard?.customer && (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              )}

              {dashboard?.customer && (
                <>
                  <ScrollReveal>
                    <section className="rounded-3xl border border-border/50 bg-card p-5 sm:p-6 shadow-card">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold text-foreground">Profile</h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {dashboard.customer.emailAddress?.emailAddress}
                        {dashboard.customer.phoneNumber?.phoneNumber
                          ? ` · ${dashboard.customer.phoneNumber.phoneNumber}`
                          : ""}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ca-first">First name</Label>
                          <Input
                            id="ca-first"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoComplete="given-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ca-last">Last name</Label>
                          <Input
                            id="ca-last"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="family-name"
                          />
                        </div>
                      </div>
                      <Button
                        className="mt-4"
                        disabled={savingProfile}
                        onClick={() => void handleSaveProfile()}
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Saving…
                          </>
                        ) : (
                          "Save profile"
                        )}
                      </Button>
                    </section>
                  </ScrollReveal>

                  <ScrollReveal delay={0.05}>
                    <section className="rounded-3xl border border-border/50 bg-card p-5 sm:p-6 shadow-card">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold text-foreground">Addresses</h2>
                      </div>
                      {dashboard.customer.defaultAddress && (
                        <div className="mb-4">
                          <p className="text-eyebrow text-muted-foreground mb-1">Default</p>
                          <div className="text-sm text-foreground whitespace-pre-line rounded-xl bg-muted/40 p-4 border border-border/40">
                            {dashboard.customer.defaultAddress.formatted.join("\n")}
                          </div>
                        </div>
                      )}
                      <div className="space-y-3">
                        {dashboard.customer.addresses.edges
                          .filter((e) => e.node.id !== dashboard.customer!.defaultAddress?.id)
                          .map(({ node }) => (
                            <div
                              key={node.id}
                              className="text-sm text-foreground whitespace-pre-line rounded-xl bg-muted/30 p-4 border border-border/30"
                            >
                              {node.formatted.join("\n")}
                            </div>
                          ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                        Address book changes may also be available during checkout on your next
                        order.
                      </p>
                    </section>
                  </ScrollReveal>

                  <ScrollReveal delay={0.1}>
                    <section className="rounded-3xl border border-border/50 bg-card p-5 sm:p-6 shadow-card">
                      <div className="flex items-center gap-2 mb-4">
                        <Package className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold text-foreground">Orders</h2>
                      </div>
                      {dashboard.customer.orders.edges.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No orders yet.</p>
                      ) : (
                        <ul className="divide-y divide-border/50">
                          {dashboard.customer.orders.edges.map(({ node: o }) => (
                            <li
                              key={o.id}
                              className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                            >
                              <div>
                                <p className="font-semibold text-foreground">{o.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(o.processedAt).toLocaleDateString()} ·{" "}
                                  {o.financialStatus ?? "—"} · {o.fulfillmentStatus}
                                </p>
                                <p className="text-sm font-medium text-foreground mt-1">
                                  {o.totalPrice.currencyCode}{" "}
                                  {parseFloat(o.totalPrice.amount).toFixed(2)}
                                </p>
                              </div>
                              <a
                                href={o.statusPageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                              >
                                Track / details
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="text-xs text-muted-foreground mt-4">
                        Prefer the main store?{" "}
                        <Link
                          to="/collections/all"
                          className="text-primary font-medium underline underline-offset-2"
                        >
                          Continue shopping
                        </Link>
                      </p>
                    </section>
                  </ScrollReveal>
                </>
              )}

              {dashboard && !dashboard.customer && !loading && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Could not load customer profile. Try signing in again.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}
