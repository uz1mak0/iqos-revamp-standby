import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

import { isStandby } from "./Backend/config";
import { buildLink as buildAwsLink } from "./Backend/links.aws";
import { buildLink as buildStandbyLink } from "./Backend/links.standby";

const client = new ApolloClient({
  // Link chain depends on the backend (NEXT_PUBLIC_BACKEND = aws | standby). See ./Backend.
  link: isStandby ? buildStandbyLink() : buildAwsLink(),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          orders: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: ["order_status", "date_filter", "warehouse_id"],

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing, incoming) {
              return {
                items: [...(existing?.items || []), ...(incoming?.items || [])],
                next_token: incoming.next_token,
              };
            },
          },
          returnOrders: {
            keyArgs: ["order_status", "date_filter", "warehouse_id"],
            merge(existing, incoming) {
              return {
                items: [...(existing?.items || []), ...(incoming?.items || [])],
                next_token: incoming.next_token,
              };
            },
          },
        },
      },
    },
  }),
});

export const ApolloWrapper = ({ children, ...props }) => {
  return (
    <ApolloProvider {...props} client={client}>
      {children}
    </ApolloProvider>
  );
};
