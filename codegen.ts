import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/GraphQL/_config/appsync.graphql",
  // documents: "src/**/*.tsx",
  // documents: "src/GraphQL/*.ts",
  generates: {
    "src/GraphQL/_gql/external/": {
      schema: "src/GraphQL/_config/external.schema.graphql",
      preset: "client",
      plugins: [],
    },
    "src/GraphQL/_gql/glife/": {
      schema: "src/GraphQL/_config/glife.schema.graphql",
      preset: "client",
      plugins: [],
    },
    "src/GraphQL/_gql/order/": {
      schema: "src/GraphQL/_config/order.schema.graphql",
      preset: "client",
      plugins: [],
    },
    "src/GraphQL/_gql/retail/": {
      schema: "src/GraphQL/_config/retail.schema.graphql",
      preset: "client",
      plugins: [],
    },
    "src/GraphQL/_gql/store/": {
      schema: "src/GraphQL/_config/store.schema.graphql",
      preset: "client",
      plugins: [],
    },
    "src/GraphQL/_gql/wms/": {
      schema: "src/GraphQL/_config/wms.schema.graphql",
      preset: "client",
      plugins: [],
    },
    "src/GraphQL/_gql/crm/": {
      schema: "src/GraphQL/_config/crm.schema.graphql",
      preset: "client",
      plugins: [],
    },
    "src/GraphQL/_gql/zyn/": {
      schema: "src/GraphQL/_config/zyn.schema.graphql",
      preset: "client",
      plugins: [],
    },
    // "src/GraphQL/_config/graphql.schema.json": {
    //   plugins: ["introspection"]
    // }
  },
  config: {
    scalars: {
      AWSJSON: "string",
      AWSDate: "string",
      AWSTime: "string",
      AWSDateTime: "string",
      AWSTimestamp: "number",
      AWSEmail: "string",
      AWSURL: "string",
      AWSPhone: "string",
      AWSIPAddress: "string",
    },
  },
};

export default config;
