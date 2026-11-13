/** Original AppSync + Cognito link chain (unchanged behaviour). */
import { createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { Auth } from "aws-amplify";
import { HttpLink, ApolloLink } from "@apollo/client";
import { ENDPOINTS, API_KEYS } from "./config";

const region = process.env.NEXT_PUBLIC_REGION;

const userAuth = {
  type: "AMAZON_COGNITO_USER_POOLS",
  jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
  credentials: async () => Auth.currentCredentials(),
};

const authFor = (kind) =>
  kind === "apiKey"
    ? { type: "API_KEY", apiKey: API_KEYS.apiKey }
    : kind === "apiKeyWarehouse"
      ? { type: "API_KEY", apiKey: API_KEYS.apiKeyWarehouse }
      : userAuth;

export const buildLink = () =>
  ApolloLink.from(
    ENDPOINTS.map((opex) => {
      const endpointAuth = authFor(opex.auth);
      return ApolloLink.split(
        (operation) => operation.getContext().clientName === opex.name,
        ApolloLink.from([
          createAuthLink({ url: opex.link, region, auth: endpointAuth }),
          createSubscriptionHandshakeLink(
            { url: opex.link, region, auth: endpointAuth },
            new HttpLink({ uri: opex.link }),
          ),
        ]),
      );
    }),
  );
