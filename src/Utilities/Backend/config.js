/**
 * Single place that decides which backend the UI talks to.
 *
 *   NEXT_PUBLIC_BACKEND=aws      (default) AppSync + Cognito + S3   -> behaviour identical to before
 *   NEXT_PUBLIC_BACKEND=standby  iqos-standby API (Railway/Postgres/B2): plain HTTP + graphql-ws + JWT
 *
 * Next.js inlines NEXT_PUBLIC_* at build time, so the mode is fixed per build.
 */
export const BACKEND = process.env.NEXT_PUBLIC_BACKEND === "standby" ? "standby" : "aws";
export const isStandby = BACKEND === "standby";

export const STANDBY_API = (process.env.NEXT_PUBLIC_STANDBY_API || "").replace(/\/$/, "");

/** GraphQL clients used across the UI (`context: { clientName }`). */
export const ENDPOINTS = [
  { name: "warehouse", link: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_WAREHOUSE, auth: "user" },
  { name: "managerAccess", link: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_WAREHOUSE, auth: "apiKeyWarehouse" },
  { name: "retail", link: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_RETAIL, auth: "user" },
  { name: "glife", link: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_GLIFE, auth: "user" },
  { name: "order", link: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_ORDER, auth: "user" },
  { name: "deliveryTracking", link: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_ORDER, auth: "apiKey" },
  { name: "external", link: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_EXTERNAL, auth: "user" },
  { name: "store", link: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_STORE, auth: "user" },
  { name: "crm", link: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_CRM, auth: "user" },
  { name: "zyn", link: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_ZYN, auth: "user" },
];

export const API_KEYS = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  apiKeyWarehouse: process.env.NEXT_PUBLIC_API_KEY_WAREHOUSE,
};

/**
 * The standby replicates only the OMS (order) and WMS (warehouse) backends.
 * Every other client name fails with a clear message instead of silently hitting AWS.
 */
export const STANDBY_SERVED = ["warehouse", "managerAccess", "order", "deliveryTracking"];
