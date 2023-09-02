import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "../backend/src/graphql/**/*.graphql",
  documents: "./src/graphql/**/*.graphql",
  generates: {
    "src/graphql/generated/": {
      preset: "client",
      // NOT Trying out a new feature 'fragment masking'. This is the new default. Idk
      // The authors are pretty gung ho about it but so far kinda annoying. Keeping it on
      // makes is so you have to use useFragment instead of just referencing the types.
      presetConfig: {
        fragmentMasking: false,
      },
      plugins: ["fragment-matcher", "typescript"],
    },
    "./src/graphql/graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
