/**
 * Shopify Customer Account API — OAuth 2.0 + PKCE (public web client).
 * @see https://shopify.dev/docs/api/customer/latest
 * @see https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/authenticate-customers
 */

const SHOP_DOMAIN = (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined)?.trim() ?? "";
const CLIENT_ID =
  (import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID as string | undefined)?.trim() ?? "";
const PUBLIC_APP_URL = (import.meta.env.VITE_PUBLIC_APP_URL as string | undefined)?.trim() ?? "";

/** OAuth + Customer Account API scopes (space-separated). */
export const CUSTOMER_ACCOUNT_SCOPES = "openid email customer-account-api:full";

const PKCE_STATE_KEY = "dardgo_oauth_state";
const PKCE_VERIFIER_KEY = "dardgo_code_verifier";
const PKCE_NONCE_KEY = "dardgo_oauth_nonce";

/** Shopify-hosted customer login (KwikPass / theme account page). */
export const SHOPIFY_KP_ACCOUNT_URL =
  (import.meta.env.VITE_SHOPIFY_ACCOUNT_LOGIN_URL as string | undefined)?.trim() ||
  "https://dardgo-6404.myshopify.com/pages/kp-account";

export function redirectToShopifyKpAccount(): void {
  if (typeof window === "undefined") return;
  window.location.assign(SHOPIFY_KP_ACCOUNT_URL);
}

export function isCustomerAccountConfigured(): boolean {
  return Boolean(SHOP_DOMAIN && CLIENT_ID && PUBLIC_APP_URL);
}

export function getCustomerAccountConfigMessage(): string | null {
  if (isCustomerAccountConfigured()) return null;
  return "Set VITE_SHOPIFY_STORE_DOMAIN, VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID, and VITE_PUBLIC_APP_URL (must match Headless redirect URLs & JS origins).";
}

export function getShopDomain(): string {
  return SHOP_DOMAIN;
}

/**
 * Base origin for OAuth `redirect_uri`, token `Origin`, and Customer Account GraphQL `Origin`.
 * In the browser we use `window.location.origin` so it matches the URL the customer actually
 * opened (www vs apex). That string must appear under Headless → Customer Account API →
 * **JavaScript origins**, and `{origin}/account/callback` under **Callback URL(s)**.
 */
export function getOAuthAppBase(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  const trimmed = PUBLIC_APP_URL.replace(/\/$/, "");
  if (!trimmed) return "";
  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed;
  }
}

export function getPublicOrigin(): string {
  return getOAuthAppBase();
}

export function getRedirectUri(): string {
  const base = getOAuthAppBase();
  return `${base}/account/callback`;
}

export function getPostLogoutRedirectUri(): string {
  const base = getOAuthAppBase();
  return `${base}/account`;
}

type OpenIdConfig = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
};

type CustomerApiDiscovery = {
  graphql_api: string;
};

let openIdCache: OpenIdConfig | null = null;
let graphqlEndpointCache: string | null = null;

export async function discoverOpenIdConfiguration(): Promise<OpenIdConfig> {
  if (openIdCache) return openIdCache;
  const res = await fetch(`https://${SHOP_DOMAIN}/.well-known/openid-configuration`);
  if (!res.ok) throw new Error(`OpenID discovery failed: ${res.status}`);
  openIdCache = (await res.json()) as OpenIdConfig;
  return openIdCache;
}

export async function discoverCustomerAccountGraphqlUrl(): Promise<string> {
  if (graphqlEndpointCache) return graphqlEndpointCache;
  const res = await fetch(`https://${SHOP_DOMAIN}/.well-known/customer-account-api`);
  if (!res.ok) throw new Error(`Customer Account API discovery failed: ${res.status}`);
  const json = (await res.json()) as CustomerApiDiscovery;
  if (!json.graphql_api) throw new Error("Missing graphql_api in customer-account-api discovery");
  graphqlEndpointCache = json.graphql_api;
  return graphqlEndpointCache;
}

function randomBase64Url(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  let bin = "";
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function generateCodeVerifier(): Promise<string> {
  return randomBase64Url(32);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const bytes = new Uint8Array(digest);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function generateOAuthState(): string {
  return randomBase64Url(16);
}

export function generateNonce(): string {
  return randomBase64Url(16);
}

/**
 * Starts OAuth: stores PKCE + state in sessionStorage and redirects to Shopify login.
 */
export async function redirectToCustomerLogin(): Promise<void> {
  if (!isCustomerAccountConfigured()) {
    throw new Error(getCustomerAccountConfigMessage() ?? "Customer Account API not configured");
  }
  const config = await discoverOpenIdConfiguration();
  const verifier = await generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  const state = generateOAuthState();
  const nonce = generateNonce();

  sessionStorage.setItem(PKCE_VERIFIER_KEY, verifier);
  sessionStorage.setItem(PKCE_STATE_KEY, state);
  sessionStorage.setItem(PKCE_NONCE_KEY, nonce);

  const url = new URL(config.authorization_endpoint);
  url.searchParams.set("scope", CUSTOMER_ACCOUNT_SCOPES);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", getRedirectUri());
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  window.location.assign(url.toString());
}

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
};

export async function exchangeAuthorizationCode(code: string): Promise<TokenResponse> {
  const config = await discoverOpenIdConfiguration();
  const verifier = sessionStorage.getItem(PKCE_VERIFIER_KEY);
  if (!verifier) throw new Error("Missing PKCE verifier — try signing in again.");

  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("client_id", CLIENT_ID);
  body.set("redirect_uri", getRedirectUri());
  body.set("code", code);
  body.set("code_verifier", verifier);

  const origin = getPublicOrigin();
  const res = await fetch(config.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: origin,
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${text}`);
  }

  sessionStorage.removeItem(PKCE_VERIFIER_KEY);
  sessionStorage.removeItem(PKCE_STATE_KEY);
  sessionStorage.removeItem(PKCE_NONCE_KEY);

  return res.json() as Promise<TokenResponse>;
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const config = await discoverOpenIdConfiguration();
  const body = new URLSearchParams();
  body.set("grant_type", "refresh_token");
  body.set("client_id", CLIENT_ID);
  body.set("refresh_token", refreshToken);

  const origin = getPublicOrigin();
  const res = await fetch(config.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: origin,
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Refresh failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<TokenResponse>;
}

export function readPkceState(): string | null {
  return sessionStorage.getItem(PKCE_STATE_KEY);
}

export function clearPkceSession(): void {
  sessionStorage.removeItem(PKCE_VERIFIER_KEY);
  sessionStorage.removeItem(PKCE_STATE_KEY);
  sessionStorage.removeItem(PKCE_NONCE_KEY);
}

export async function customerAccountGraphql<T = unknown>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const endpoint = await discoverCustomerAccountGraphqlUrl();
  const origin = getPublicOrigin();
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
      Origin: origin,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json.data as T;
}

export const CUSTOMER_DASHBOARD_QUERY = `#graphql
  query CustomerDashboard {
    customer {
      id
      displayName
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      defaultAddress {
        id
        formatted(withName: true, withCompany: true)
        formattedArea
      }
      addresses(first: 20) {
        edges {
          node {
            id
            formatted(withName: true, withCompany: true)
            formattedArea
          }
        }
      }
      orders(first: 25, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            statusPageUrl
          }
        }
      }
    }
  }
`;

export type CustomerDashboardData = {
  customer: {
    id: string;
    displayName: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: { emailAddress: string } | null;
    phoneNumber: { phoneNumber: string } | null;
    defaultAddress: {
      id: string;
      formatted: string[];
      formattedArea: string | null;
    } | null;
    addresses: {
      edges: Array<{
        node: {
          id: string;
          formatted: string[];
          formattedArea: string | null;
        };
      }>;
    };
    orders: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          processedAt: string;
          financialStatus: string | null;
          fulfillmentStatus: string;
          totalPrice: { amount: string; currencyCode: string };
          statusPageUrl: string;
        };
      }>;
    };
  } | null;
};

export async function logoutCustomer(idToken: string): Promise<void> {
  const config = await discoverOpenIdConfiguration();
  const url = new URL(config.end_session_endpoint);
  url.searchParams.set("id_token_hint", idToken);
  url.searchParams.set("post_logout_redirect_uri", getPostLogoutRedirectUri());
  window.location.assign(url.toString());
}

export const CUSTOMER_UPDATE_MUTATION = `#graphql
  mutation customerUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      userErrors {
        field
        message
      }
      customer {
        firstName
        lastName
        displayName
      }
    }
  }
`;

export type CustomerUpdateResult = {
  customerUpdate: {
    userErrors: Array<{ field: string[] | null; message: string }>;
    customer: { firstName: string | null; lastName: string | null; displayName: string } | null;
  };
};
