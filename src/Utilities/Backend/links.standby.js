/** Standby link chain: plain HTTP + graphql-ws against iqos-standby (no AppSync / Cognito). */
import { HttpLink, ApolloLink, Observable } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";
import { createClient } from "graphql-ws";
import { Auth } from "./standby";
import { ENDPOINTS, API_KEYS, STANDBY_SERVED } from "./config";

const authHeaders = async (opex) => {
  if (opex.auth === "apiKey") return { "x-api-key": API_KEYS.apiKey };
  if (opex.auth === "apiKeyWarehouse") return { "x-api-key": API_KEYS.apiKeyWarehouse };
  const s = await Auth.currentSession();
  return { authorization: s.getIdToken().getJwtToken() };
};

const wsUrl = (u) => u.replace(/^http/, "ws");
const isSubscription = ({ query }) => {
  const d = getMainDefinition(query);
  return d.kind === "OperationDefinition" && d.operation === "subscription";
};

/** Endpoints the standby does not replicate fail loudly instead of falling through. */
const unavailable = (name) =>
  new ApolloLink(
    () =>
      new Observable((observer) =>
        observer.error(new Error(`The "${name}" service is not available in standby mode.`)),
      ),
  );

const forEndpoint = (opex) => {
  const http = ApolloLink.from([
    setContext(async (_, { headers }) => ({ headers: { ...headers, ...(await authHeaders(opex)) } })),
    new HttpLink({ uri: opex.link }),
  ]);
  if (typeof window === "undefined") return http;
  const ws = new GraphQLWsLink(
    createClient({
      url: wsUrl(opex.link),
      lazy: true,
      retryAttempts: Infinity,
      connectionParams: async () => {
        const h = await authHeaders(opex);
        return { Authorization: h.authorization, "x-api-key": h["x-api-key"] };
      },
    }),
  );
  return ApolloLink.split(isSubscription, ws, http);
};

export const buildLink = () =>
  ApolloLink.from([
    ...ENDPOINTS.map((opex) =>
      ApolloLink.split(
        (operation) => operation.getContext().clientName === opex.name,
        STANDBY_SERVED.includes(opex.name) && opex.link ? forEndpoint(opex) : unavailable(opex.name),
      ),
    ),
    // operations without a known clientName
    unavailable("unknown"),
  ]);
