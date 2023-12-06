import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./apps/backend/src/graphql/**/*.graphql",
  documents: "./apps/frontend//src/graphql/**/*.graphql",
  generates: {
    "./apps/frontend/src/graphql/generated/": {
      preset: "client",
      // NOT Trying out a new feature 'fragment masking'. This is the new default. Idk
      // The authors are pretty gung ho about it but so far kinda annoying. Keeping it on
      // makes is so you have to use useFragment instead of just referencing the types.
      presetConfig: {
        fragmentMasking: false,
      },
      plugins: ["fragment-matcher", "typescript"],
    },
    "./apps/frontend/src/graphql/graphql.schema.json": {
      plugins: ["introspection"],
    },
    "./apps/backend/src/graphql/generated/resolver-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../context#GraphqlRequestContext",
      },
    },
  },
};

export default config;
